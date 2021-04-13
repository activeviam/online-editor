export interface GrammarRequestResult {
  tokens: string[];
  warnings?: string[];
}

export interface GrammarRequestError {
  errors: string[];
}

export const instanceOfGrammarRequestResult = (
  object: any
): object is GrammarRequestResult => {
  return "tokens" in object;
};

export const instanceOfGrammarRequestError = (
  object: any
): object is GrammarRequestError => {
  return "errors" in object;
};
