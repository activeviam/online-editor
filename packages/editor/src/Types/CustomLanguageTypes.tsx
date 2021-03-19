export interface TokenInfo {
  text: string;
  type: string;
  line: number;
  start: number;
  stop: number;
}

export interface ParsedCustomLanguage {
  ruleNames: string[];
  code: string;
  tokens: TokenInfo[];
}
