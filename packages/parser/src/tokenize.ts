import { Token } from "moo";

import moo from "moo";

const KEYWORDS = ["const"];

const OPERATORS = ["="];

const lexer = moo.compile({
  whitespace: /[ \t]+/,
  number: {
    match: /0|[1-9][0-9]*/,
    value: (n) => Number(n),
  },
  identifier: {
    match: /[a-zA-Z_]\w*/,
    type: moo.keywords(Object.fromEntries(KEYWORDS.map((k) => ["kw-" + k, k]))),
  },
  operator: OPERATORS,
});

export function tokenize(code: string): Array<Token> {
  lexer.reset(code);
  const tokensArray = Array.from(lexer);
  return tokensArray;
}
