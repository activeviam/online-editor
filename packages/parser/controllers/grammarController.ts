/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";

import Handlebars from "handlebars";
// Register Handlebars helper function
Handlebars.registerHelper("toTitleCase", (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
});

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

// Compiling Grammar to parser and lexer
const runAntlr = (
  filename: string,
  grammarPath: string,
  grammarRoot: string,
) => {
  const directory = path.dirname(grammarPath);
  const grammarName = filename.split(".")[0];

  // Compile the grammar. The compilation flags are set in the .env file
  const child = spawn(ANTLR4TS, [...ANTLR_FLAGS.split(" "), grammarPath]);
  
  /*
  child.stdout.on("data", (data) => console.log(data.toString()));
  child.stderr.on("data", (data) => console.log(data.toString()));
  */

  child.on("exit", () => {
    generateParserFile(grammarName, directory);
    generateLexerFile(grammarName, grammarRoot, directory);
    generateAstTreeFile(grammarName, grammarRoot, directory);
  });
};

// Create grammar related functions
const generateParserFile = (grammarName: string, directory: string) => {
  // Generate a function that returns the AST of a given code
  const parserTemplateFile = fs.readFileSync(`${ASSETS}/parser.hbs`).toString();
  const parserTemplate = Handlebars.compile(parserTemplateFile);

  const source = parserTemplate({
    grammarName: grammarName,
  });
  fs.writeFileSync(path.join(directory, "parser.ts"), source);
};

const generateLexerFile = (

  grammarName: string,
  grammarRoot: string,
  directory: string,
) => {
  // Generate a function that returns the AST of a given code
  const lexerTemplateFile = fs.readFileSync(`${ASSETS}/lexer.hbs`).toString();
  const lexerTemplate = Handlebars.compile(lexerTemplateFile);

  const source = lexerTemplate({
    grammarName: grammarName,
    grammarRoot: grammarRoot,
  });
  fs.writeFileSync(path.join(directory, "lexer.ts"), source);
};

const generateAstTreeFile = (
  grammarName: string,
  grammarRoot: string,
  directory: string,
) => {
  // Generate a function that returns the AST of a given code
  const parseTreeTemplateFile = fs
    .readFileSync(`${ASSETS}/parseTree.hbs`)
    .toString();
  const parseTreeTemplate = Handlebars.compile(parseTreeTemplateFile);

  const source = parseTreeTemplate({
    grammarName: grammarName,
    grammarRoot: grammarRoot,
  });
  fs.writeFileSync(path.join(directory, "parseTree.ts"), source);

};

// Routes controllers

export const compileGrammarFile = (req: any, res: any) => {
  upload(req, res, (err: any) => {
    if (err) {
      return res.status(500).json(err);
    }

    runAntlr(req.file.filename, req.file.path, req.body.grammarRoot);

    // Storing grammar data in the session
    const grammar = Object();
    grammar.name = req.file.filename.split(".")[0];
    grammar.root = req.body.grammarRoot;
    req.session.grammar = grammar;

    return res.status(200).send("OK");
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
  runAntlr(filename, path.join(_path, filename), req.body.grammarRoot);

  // Storing grammar data in the session
  const grammar = Object();
  grammar.name = grammarName;
  grammar.root = req.body.grammarRoot;
  req.session.grammar = grammar;

  return res.status(200).send("OK");
};
