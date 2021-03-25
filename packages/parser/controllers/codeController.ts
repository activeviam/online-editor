export const generateAST = async (req: any, res: any): Promise<void> => {
  const codeString = req.body.code;
  const sessionID = req.sessionID;
  const grammar = req.session.grammar;

  const grammarName = grammar.name[0].toUpperCase() + grammar.name.slice(1);

  const lexerModule = await import(
    `../grammar/${sessionID}/get${grammarName}Lexer.ts`
  );
  const grammarLexer = await import(
    `../grammar/${sessionID}/${grammar.name}Lexer.ts`
  );
  const parserModule = await import(
    `../grammar/${sessionID}/get${grammarName}Parser.ts`
  );
  const parseTreeModule = await import(
    `../grammar/${sessionID}/get${grammarName}ParseTree.ts`
  );

  // Creating lexer
  const getLexer = lexerModule.default;
  const lexerClass = grammarLexer[`${grammar.name}Lexer`];
  const ruleNames = lexerClass.ruleNames;
  const lexer = getLexer(codeString);

  // Generating the tokens
  const result = lexer.getAllTokens();

  // Generating the parse tree
  const getParserFromLexer = parserModule.default;

  const parser = getParserFromLexer(lexer);

  const getParseTree = parseTreeModule.default;
  const parseTree = getParseTree(codeString);

  console.log("parseTree:", parseTree.toStringTree(parser.ruleNames));

  // Tokens object
  const tokens = result.map((token: any) => ({
    text: token.text,
    type: ruleNames[token.type - 1],
    line: token.line,
    column: token.charPositionInLine,
    start: token.start,
    stop: token.stop,
  }));

  res.status(200).json({
    ruleNames: ruleNames,
    code: codeString,
    tokens: tokens,
  });
};
