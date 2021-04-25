/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

import dotenv from "dotenv";
import {
  generateAstTreeFile,
  generateLexerFile,
  generateParserFile,
} from "./grammarTemplatesGenerator";
dotenv.config();

import { AntlrError } from "../errors/antlrError";
import { RequestError } from "../errors/requestError";

// Constants
const ANTLR4TS = process.env.ANTLR4TS || "";
const ANTLR_FLAGS = process.env.ANTLR_FLAGS || "";
const GRAMMAR_STORAGE = process.env.GRAMMAR_STORAGE || "grammar";

// File Upload handlers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const sessionID = req.sessionID;

    const _path = path.join(GRAMMAR_STORAGE, sessionID);
    if (fs.existsSync(_path)) {
      fs.rmSync(_path, { recursive: true });
    }
    fs.mkdirSync(_path, { recursive: true });
    cb(null, _path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

// Get the defined tokens in the grammar
// The generic tokens (which were not properly defined) are returned as their literals
const getGrammarTokens = async (
  sessionID: string,
  grammarName: string,
): Promise<string[]> => {
  return new Promise(async (resolve) => {
    const grammarLexerPath = `../grammar/${sessionID}/${grammarName}Lexer.ts`;

    const grammarLexer = await import(grammarLexerPath);
    const lexerClass = grammarLexer[`${grammarName}Lexer`];

    const ruleNames = lexerClass.ruleNames;
    const literals = lexerClass._LITERAL_NAMES;
    resolve(
      ruleNames.map((token: string) => {
        if (token.startsWith("T__")) {
          const ind = parseInt(token.substring(3));
          return literals[ind + 1];
        }
        return token;
      }),
    );
  });
};

// Compiling Grammar to parser and lexer
const runAntlr = (
  filename: string,
  grammarPath: string,
  grammarRoot: string,
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const directory = path.dirname(grammarPath);
    const grammarName = filename.split(".")[0];

    // Compile the grammar. The compilation flags are set in the .env file
    const child = spawn(ANTLR4TS, [...ANTLR_FLAGS.split(" "), grammarPath]);

    const compilationErrors: string[] = [];
    const compilationWarnings: string[] = [];
    child.stderr.on("data", (data) => {
      const msg: string = data.toString();
      const msg_details: string[] = msg.split(":");
      // by default the second element of msg_details contains the full path to the grammar
      // Which can be critical. Thus we remove the full path
      msg_details.splice(1, 1);
      if (msg_details[0].startsWith("error")) {
        compilationErrors.push(msg_details.join(":"));
      } else if (msg_details[0].startsWith("warning")) {
        compilationWarnings.push(msg_details.join(":"));
      }
    });

    child.on("exit", () => {
      if (compilationErrors.length) {
        reject(new AntlrError("Compilation failed", compilationErrors));
      } else {
        generateParserFile(grammarName, directory);
        generateLexerFile(grammarName, grammarRoot, directory);
        generateAstTreeFile(grammarName, grammarRoot, directory);
        resolve(compilationWarnings);
      }
    });
  });
};

// Routes controllers

export const compileGrammarFile = (req: any, res: any) => {
  upload(req, res, async (err: any) => {
    if (err) {
      return res.status(500).json(err);
    }

    // Check if the request contains the required attributes
    if (req.file === undefined || req.body.grammarRoot === undefined) {
      const missingAttributes: string[] = [];
      if (req.file === undefined) {
        missingAttributes.push("file");
      }
      if (req.body.grammarRoot === undefined) {
        missingAttributes.push("grammarRoot");
      }
      const err = new RequestError(missingAttributes);
      return res.status(400).json({ message: err.message });
    }

    // Run ANTLR on the grammar file
    runAntlr(req.file.filename, req.file.path, req.body.grammarRoot)
      .then(async (warningStack) => {
        // Storing grammar data in the session
        const grammar = Object();
        grammar.name = req.file.filename.split(".")[0];
        grammar.root = req.body.grammarRoot;
        req.session.grammar = grammar;
        getGrammarTokens(req.sessionID, grammar.name).then(
          (tokens: string[]) => {
            return res.status(200).json({
              warnings: warningStack,
              tokens: tokens,
            });
          },
        );
      })
      .catch((err: Error) => {
        if (err instanceof AntlrError) return res.status(400).json(err);
        else return res.status(500).json(err);
      });
  });
};

export const compileGrammarString = (req: any, res: any) => {
  // Check if the request contains the required attributes
  if (req.body.grammar === undefined || req.body.grammarRoot === undefined) {
    const missingAttributes: string[] = [];
    if (req.body.grammar === undefined) {
      missingAttributes.push("grammar");
    }
    if (req.body.grammarRoot === undefined) {
      missingAttributes.push("grammarRoot");
    }
    const err = new RequestError(missingAttributes);
    return res.status(400).json({ message: err.message });
  }
  const grammarString: string = req.body.grammar;

  /*
  This assumes the first occurence of a line that starts with 'grammar'
  is the line where the grammar name is defined
  */

  let grammarName = grammarString
    .split("\n")
    .filter((s: string) => s.startsWith("grammar"))[0];
  grammarName = grammarName.split(" ")[1].replace(";", "");

  const filename = grammarName + ".g4";

  const sessionID = req.sessionID;

  const _path = path.join(GRAMMAR_STORAGE, sessionID); // Path where to store the grammar related files

  if (fs.existsSync(_path)) {
    fs.rmdirSync(_path, { recursive: true });
  }
  fs.mkdirSync(_path, { recursive: true });

  // Write grammar in file
  fs.writeFileSync(path.join(_path, filename), grammarString);

  // Run ANTLR on the grammar file
  runAntlr(filename, path.join(_path, filename), req.body.grammarRoot)
    .then(async (warningStack) => {
      // Storing grammar data in the session
      const grammar = Object();
      grammar.name = grammarName;
      grammar.root = req.body.grammarRoot;
      req.session.grammar = grammar;

      return res.status(200).json({
        warnings: warningStack,
        tokens: await getGrammarTokens(req.sessionID, grammar.name),
      });
    })
    .catch((err: Error) => {
      if (err instanceof AntlrError) return res.status(400).json(err);
      else return res.status(500).json(err);
    });
};
