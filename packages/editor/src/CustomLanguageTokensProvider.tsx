import { languages } from "monaco-editor";

import { buildParsedTokensByLine } from "./RequestPostprocessing";

import { ParsedCustomLanguage, TokenInfo } from "./Types/CustomLanguageTypes";

/*
Interface between tokens given by the back-end and monaco-editor.
Feeds monaco-editor the user's custom tokens (defined by grammar).
*/

export class CustomLanguageState implements languages.IState {
  lineNumber: number;

  constructor(lineNumber: number) {
    this.lineNumber = lineNumber;
  }

  clone(): CustomLanguageState {
    return new CustomLanguageState(this.lineNumber);
  }

  equals(other: CustomLanguageState): boolean {
    return other.lineNumber === this.lineNumber;
  }
}

export class CustomTokensProvider implements languages.TokensProvider {
  tokensByLine: Map<number, TokenInfo[]>;

  constructor(parseResult: ParsedCustomLanguage) {
    /* Create a map of tokens with the line number as key */
    this.tokensByLine = buildParsedTokensByLine(parseResult);
  }

  getInitialState(): languages.IState {
    return new CustomLanguageState(1);
  }

  tokenize(line: string, state: CustomLanguageState): languages.ILineTokens {
    const lineNumber = state.lineNumber;
    const tokensThisLine = this.tokensByLine.get(lineNumber);

    const lineTokens = tokensThisLine
      ? tokensThisLine.map((token: TokenInfo) => ({
          startIndex: token.start,
          scopes: token.type,
        }))
      : [];

    return {
      tokens: lineTokens,
      endState: new CustomLanguageState(lineNumber + 1),
    };
  }
}