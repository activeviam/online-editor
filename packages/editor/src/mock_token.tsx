import {
  IdentifierToken,
  NumberLiteralToken,
  Token,
  TokenID,
  WhitespaceToken,
} from "@online-editor-2020/parser";

// mock for "const a = 1"

export const mockInput = [
  new Token(TokenID.Const),
  new WhitespaceToken(TokenID.Whitespace, " "),
  new IdentifierToken("a", false),
  new WhitespaceToken(TokenID.Whitespace, " "),
  new Token(TokenID.Equals),
  new WhitespaceToken(TokenID.Whitespace, " "),
  new NumberLiteralToken(1, "1"),
];

export const expectedText = ["const", " ", "a", " ", "=", " ", "1"];
