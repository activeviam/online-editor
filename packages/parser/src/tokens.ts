/* reference: https://github.com/guidobouman/typescript/blob/master/src/compiler/tokens.ts
   completed as needed. */

export enum TokenID {
  // Keywords
  Const,
  // Punctuation
  Equals,
  Identifier,
  NumberLiteral,
  Whitespace
}

export class TokenInfo {
  constructor (public tokenId: TokenID, public text: string) { }
}

export function lookupToken(tokenId: TokenID): TokenInfo {
  return tokenTable.get(tokenId)!;
}

export var tokenTable = new Map<TokenID, TokenInfo>();

function setTokenInfo(tokenId: TokenID, text: string) {
  if (tokenId !== undefined) {
    tokenTable.set(tokenId, new TokenInfo(tokenId, text));
  }
}

setTokenInfo(TokenID.Const, "const");
setTokenInfo(TokenID.Equals, "=");
setTokenInfo(TokenID.Identifier, "identifier");
setTokenInfo(TokenID.NumberLiteral, "numberLiteral");
setTokenInfo(TokenID.Whitespace, " ");
