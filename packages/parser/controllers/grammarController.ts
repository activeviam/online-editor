/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import Handlebars from "handlebars";

import dotenv from "dotenv";
dotenv.config();

// Constants
const ANTLR4TS = process.env.ANTLR4TS || "";
const ANTLR_FLAGS = process.env.ANTLR_FLAGS || "";
const GRAMMAR_STORAGE = process.env.GRAMMAR_STORAGE || "grammar";
const ASSETS = process.env.ASSETS || "assets";

// File Upload handlers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const sessionID = req.sessionID;

    const _path = path.join(GRAMMAR_STORAGE, sessionID);
    fs.rmSync(_path, { recursive: true });
    fs.mkdirSync(_path, { recursive: true });
    cb(null, _path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

// Compiling Grammar to parser and lexer
const runAntlr = (
  filename: string,
  grammarPath: string,
  grammarRoot: string,
) => {
  const directory = path.dirname(grammarPath);
  const grammarName = filename.split(".")[0];
  console.log(
    `directory: ${directory}`,
    `grammarName: ${grammarName}`,
    `grammarRoot: ${grammarRoot}`,
  );

  // Compile the grammar. The compilation flags are set in the .env file
  const child = spawn(ANTLR4TS, [...ANTLR_FLAGS.split(" "), grammarPath]);

  child.on("exit", () => {
    generateAstParserFile(grammarName, grammarRoot, directory);
  });
};

// Create grammar related functions
const generateAstParserFile = (
  grammarName: string,
  grammarRoot: string,
  directory: string,
) => {
  // Register Handlebars helper function
  Handlebars.registerHelper("toTitleCase", (str: string) => {
    return str[0].toUpperCase() + str.slice(1);
  });

  // Generate a function that returns the AST of a given code
  const parserTemplateFile = fs.readFileSync(`${ASSETS}/parser.hbs`).toString();
  const parserTemplate = Handlebars.compile(parserTemplateFile);

  const source = parserTemplate({
    grammarName: grammarName,
    grammarRoot: grammarRoot,
  });
  fs.writeFileSync(path.join(directory, "parser.ts"), source);
};

// Routes controllers

export const compileGrammarFile = (req: any, res: any) => {
  upload(req, res, (err: any) => {
    if (err) {
      return res.status(500).json(err);
    }
    runAntlr(req.file.filename, req.file.path, req.body.grammarRoot);
    return res.status(200).send(req.file);
  });
};
