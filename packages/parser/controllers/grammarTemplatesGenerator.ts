import path from "path";
import fs from "fs";

import Handlebars from "handlebars";
// Register Handlebars helper function
Handlebars.registerHelper("toTitleCase", (str: string) => {
  return str[0].toUpperCase() + str.slice(1);
});

import dotenv from "dotenv";
dotenv.config();

const ASSETS = process.env.ASSETS || "assets";

// Create grammar related functions
export const generateParserFile = (grammarName: string, directory: string) : void => {
    // Generate a function that returns the AST of a given code
    const parserTemplateFile = fs.readFileSync(`${ASSETS}/parser.hbs`).toString();
    const parserTemplate = Handlebars.compile(parserTemplateFile);
  
    const source = parserTemplate({
      grammarName: grammarName,
    });
    fs.writeFileSync(path.join(directory, "parser.ts"), source);
};

export const generateLexerFile = (
    grammarName: string,
    grammarRoot: string,
    directory: string,
  ) : void => {
    // Generate a function that returns the AST of a given code
    const lexerTemplateFile = fs.readFileSync(`${ASSETS}/lexer.hbs`).toString();
    const lexerTemplate = Handlebars.compile(lexerTemplateFile);
  
    const source = lexerTemplate({
      grammarName: grammarName,
      grammarRoot: grammarRoot,
    });
    fs.writeFileSync(path.join(directory, "lexer.ts"), source);
  };

export const generateAstTreeFile = (
    grammarName: string,
    grammarRoot: string,
    directory: string,
  ) : void => {
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