import { ANTLRErrorListener, RecognitionException, Recognizer } from "antlr4ts";

export class CustomAntlrErrorListener implements ANTLRErrorListener<any> {
  errosStack: CodeProcessingError[] = [];

  syntaxError(
    recognizer: Recognizer<any, any>,
    offendingSymbol: any,
    line: number,
    charPositionInLine: number,
    msg: string,
    e: RecognitionException | undefined,
  ): void {
    this.errosStack.push(
      new CodeProcessingError(msg, line, charPositionInLine),
    );
  }
}

export class CodeProcessingError extends Error {
  line: number;
  col: number;
  constructor(message: string, line: number, col: number) {
    super(message);
    this.line = line;
    this.col = col;
  }
}
