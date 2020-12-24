import { TokenID } from "@online-editor-2020/parser"

// mock for "const a = 1"

export const mockInput = [
  TokenID.Const,
  TokenID.Whitespace,
  TokenID.Identifier,
  TokenID.Whitespace,
  TokenID.Equals,
  TokenID.Whitespace,
  TokenID.NumberLiteral
]

export const expectedKeywords = [
  "const",
  " ",
  "identifier",
  " ",
  "=",
  " ",
  "numberLiteral"
]
