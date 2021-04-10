import { RequestError } from "../errors/requestError";
import { CodeProcessingError } from "../errors/CustomAntlrErrorListener";

export const generateAST = async (req: any, res: any): Promise<void> => {
  if (req.body.code === undefined) {
    const err = new RequestError(["code"]);
    return res.status(400).json({ message: err.message });
  }
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

  let parseTreeModule;
  try {
    parseTreeModule = await import(
      `../grammar/${sessionID}/get${grammarName}ParseTree.ts`
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: "Error loading the AST parser. Please verify your grammar root.",
    });
  }

  // Creating lexer
  const getLexer = lexerModule.default;
  const lexerClass = grammarLexer[`${grammar.name}Lexer`];
  const ruleNames = lexerClass.ruleNames;
  const literals = lexerClass._LITERAL_NAMES;
  let lexer, result, parser, parseTree;
  try {
    lexer = getLexer(codeString);
    // Generating the tokens
    result = lexer.getAllTokens();
  } catch (error) {
    if (error instanceof CodeProcessingError)
      return res
        .status(400)
        .json({ message: error.message, line: error.line, col: error.col });
    return res.status(500).json(error);
  }

  // Generating the parse tree
  const getParserFromLexer = parserModule.default;
  try {
    parser = getParserFromLexer(lexer);
  } catch (error) {
    if (error instanceof CodeProcessingError)
      return res
        .status(400)
        .json({ message: error.message, line: error.line, col: error.col });
    return res.status(500).json(error);
  }

  const getParseTree = parseTreeModule.default;
  try {
    parseTree = getParseTree(codeString);
  } catch (error) {
    if (error instanceof CodeProcessingError)
      return res
        .status(400)
        .json({ message: error.message, line: error.line, col: error.col });
    return res.status(500).json(error);
  }

  const orgChart = generateChart(parseTree, parser, ruleNames, literals);

  // Tokens object
  const tokens = result.map((token: any) => ({
    text: token.text,
    type: ruleNames[token.type - 1],
    line: token.line,
    column: token.charPositionInLine,
    start: token.start,
    stop: token.stop,
  }));

  return res.status(200).json({
    ruleNames: ruleNames,
    code: codeString,
    tokens: tokens,
    orgChart: orgChart,
  });
};

const generateChart = (
  parseTree: any,
  parser: any,
  ruleNames: any,
  literals: any,
): ChartNode => {
  const stringTree: string = parseTree.toStringTree(parser);
  const isTerminalNode = parseTree.children === undefined;

  if (isTerminalNode) {
    let name: string = ruleNames[parseTree.symbol.type - 1];
    if (name.startsWith("T__")) {
      const ind = parseInt(name.substring(3));
      name = literals[ind + 1];
    }
    return new ChartNode(name, undefined, {
      content: parseTree.text,
    });
  } else {
    const name = stringTree.split(" ")[0].slice(1);
    const children: ChartNode[] = [];
    parseTree.children.forEach((child: any) =>
      children.push(generateChart(child, parser, ruleNames, literals)),
    );
    return new ChartNode(name, children);
  }
};

class ChartNode {
  name: string;
  attributes: Record<string, string> | undefined;
  children: ChartNode[] | undefined;
  constructor(
    name: string,
    children: ChartNode[] | undefined = undefined,
    attributes: Record<string, string> | undefined = undefined,
  ) {
    this.name = name;
    this.attributes = attributes;
    this.children = children;
  }
}
