export class AntlrError extends Error {
  errors: string[];
  constructor(message: string, errorStack: string[]) {
    super(message);
    this.errors = errorStack;
  }
}
