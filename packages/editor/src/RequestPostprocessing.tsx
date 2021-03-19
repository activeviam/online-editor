import { ParsedCustomLanguage, TokenInfo } from "./Types/CustomLanguageTypes";

export const buildParsedTokensByLine = (
  requestResponse: ParsedCustomLanguage
): Map<number, TokenInfo[]> => {
  const tokensByLine = new Map();
  requestResponse.tokens.forEach((token: TokenInfo) => {
    const lineArray = tokensByLine.get(token.line);
    if (lineArray === undefined) {
      tokensByLine.set(token.line, []);
    }
    tokensByLine.get(token.line)!.push(token);
  });
  return tokensByLine;
};
