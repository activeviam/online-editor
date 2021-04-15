export interface TokenInfo {
  text: string;
  type: string;
  line: number;
  column: number;
  start: number;
  stop: number;
}

export interface ParsedCustomLanguage {
  ruleNames: string[];
  code: string;
  tokens: TokenInfo[];
  orgChart: any;
  lexerErrors: ParseError[];
}

export interface ParseError {
  message: string;
  line: number;
  col: number;
}

export const instanceOfParsedCustomLanguage = (
  object: any
): object is ParsedCustomLanguage => {
  return (
    "ruleNames" in object &&
    "code" in object &&
    "tokens" in object &&
    "orgChart" in object &&
    "lexerErrors" in object
  );
};
