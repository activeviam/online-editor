/* reference: https://github.com/guidobouman/typescript/blob/master/src/compiler/tokens.ts
   completed as needed. */

export enum TokenID {
  // Keywords
  Const,
  // Punctuation
  Equals,
  Identifier,
  NumberLiteral,
  Whitespace,
}

export class TokenInfo {
  constructor(public tokenId: TokenID, public text: string) {}
}

export const lookupToken = (tokenId: TokenID): TokenInfo => {
  return tokenTable.get(tokenId)!;
};

export var tokenTable = new Map<TokenID, TokenInfo>();

const setTokenInfo = (tokenId: TokenID, text: string) => {
  if (tokenId !== undefined) {
    tokenTable.set(tokenId, new TokenInfo(tokenId, text));
  }
};

setTokenInfo(TokenID.Const, "const");
setTokenInfo(TokenID.Equals, "=");
setTokenInfo(TokenID.Identifier, "identifier");
setTokenInfo(TokenID.NumberLiteral, "numberLiteral");
setTokenInfo(TokenID.Whitespace, " ");

export class Token {
  constructor(public tokenId: TokenID) {}

  public toString() {
    return (
      "token: " +
      this.tokenId +
      " " +
      this.getText() +
      " (" +
      (<any>TokenID)._map[this.tokenId] +
      ")"
    );
  }

  public print(line: number, outfile: any) {
    outfile.WriteLine(this.toString() + ",on line" + line);
  }

  public getText(): string {
    return lookupToken(this.tokenId).text;
  }
}

export class NumberLiteralToken extends Token {
  constructor(public value: number, public text: string) {
    super(TokenID.NumberLiteral);
  }

  public getText(): string {
    return this.text;
  }
}

export class IdentifierToken extends Token {
  constructor(public value: string, public hasEscapeSequence: boolean) {
    super(TokenID.Identifier);
  }
  public getText(): string {
    return this.value;
  }
}

export class WhitespaceToken extends Token {
  constructor(tokenId: TokenID, public value: string) {
    super(tokenId);
  }

  public getText(): string {
    return this.value;
  }
}
