export class AntlrError extends Error {
  errorStack: string[];
  constructor(message: string, stack: string[]) {
    super(message);
    this.errorStack = stack;
  }
}