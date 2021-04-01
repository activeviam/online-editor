import { getTokenPragmaticDescription } from "../TokenizeTheme";

import { editor, Position } from "monaco-editor";

import { TokenInfo } from "../Types/TokenizeTypes";

export const getTokenizeHoverProvider = (
  tokensByLine: Map<number, TokenInfo[]>
) => ({
  provideHover: (model: editor.ITextModel, position: Position) => {
    const { column, lineNumber } = position;

    const tokensCurrentLine = tokensByLine.get(lineNumber);

    if (tokensCurrentLine === undefined) {
      return { contents: [] };
    } else if (tokensCurrentLine.length === 1) {
      return {
        contents: [
          { value: getTokenPragmaticDescription(tokensCurrentLine[0]) },
        ],
      };
    }

    const correctToken = tokensCurrentLine
      .slice()
      .reverse()
      .find((candidate: TokenInfo) => candidate.column < column);

    if (correctToken === undefined) {
      return { contents: [] };
    }

    return {
      contents: [{ value: getTokenPragmaticDescription(correctToken) }],
    };
  },
});
