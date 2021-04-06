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

const getGrammarTokens = async (
  sessionID: string,
  grammarName: string,
): Promise<string[]> => {
  const grammarLexer = await import(
    `../grammar/${sessionID}/${grammarName}Lexer.ts`
  );
  const lexerClass = grammarLexer[`${grammarName}Lexer`];
  console.log(lexerClass.VOCABULARY);

  const ruleNames = lexerClass.ruleNames;
  const literals = lexerClass._LITERAL_NAMES;
  return ruleNames.map((token: string) => {
    if (token.startsWith("T__")) {
      const ind = parseInt(token.substring(3));
      return literals[ind + 1];
    }
    return token;
  });
};

// Compiling Grammar to parser and lexer
const runAntlr = (
  filename: string,
  grammarPath: string,
  grammarRoot: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const directory = path.dirname(grammarPath);
    const grammarName = filename.split(".")[0];

    // Compile the grammar. The compilation flags are set in the .env file
    const child = spawn(ANTLR4TS, [...ANTLR_FLAGS.split(" "), grammarPath]);

    const compilationErrors: string[] = [];
    child.stderr.on("data", (data) => {
      compilationErrors.push(data.toString());
    });

    child.on("exit", () => {
      if (compilationErrors.length) {
        reject(new AntlrError("Error at grammar compiling", compilationErrors));
      } else {
        generateParserFile(grammarName, directory);
        generateLexerFile(grammarName, grammarRoot, directory);
        generateAstTreeFile(grammarName, grammarRoot, directory);
        resolve(true);
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
    // Run ANTLR on the grammar file
    runAntlr(req.file.filename, req.file.path, req.body.grammarRoot)
      .then(async () => {
        // Storing grammar data in the session
        const grammar = Object();
        grammar.name = req.file.filename.split(".")[0];
        grammar.root = req.body.grammarRoot;
        req.session.grammar = grammar;

        return res.status(200).json({
          tokens: await getGrammarTokens(req.sessionID, grammar.name),
        });
      })
      .catch((err: Error) => {
        if (err instanceof AntlrError) return res.status(400).json(err);
        else return res.status(500).json(err);
      });
  });
};

export const compileGrammarString = (req: any, res: any) => {
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
    fs.rmSync(_path, { recursive: true });
  }
  fs.mkdirSync(_path, { recursive: true });

  // Write grammar in file
  fs.writeFileSync(path.join(_path, filename), grammarString);

  // Run ANTLR on the grammar file
  runAntlr(filename, path.join(_path, filename), req.body.grammarRoot)
    .then(async () => {
      // Storing grammar data in the session
      const grammar = Object();
      grammar.name = grammarName;
      grammar.root = req.body.grammarRoot;
      req.session.grammar = grammar;

      return res.status(200).json({
        tokens: await getGrammarTokens(req.sessionID, grammar.name),
      });
    })
    .catch((err: Error) => {
      if (err instanceof AntlrError) return res.status(400).json(err);
      else return res.status(500).json(err);
    });
};
