import { CancellationToken, editor, languages, Position } from "monaco-editor";

/* Add completion suggestions for generic tokens, i.e., tokens between single quotes. */

import { TokenPragmaticId } from "../TokenizeTheme";

export class CustomLanguageCompletionItemProvider
  implements languages.CompletionItemProvider {
  tokenPragmaticIds: TokenPragmaticId[] | undefined;

  constructor(tokenPragmaticIds: TokenPragmaticId[] | undefined) {
    this.tokenPragmaticIds = tokenPragmaticIds;
  }

  provideCompletionItems(
    model: editor.ITextModel,
    position: Position,
    context: languages.CompletionContext,
    token: CancellationToken
  ): languages.ProviderResult<languages.CompletionList> {
    if (this.tokenPragmaticIds === undefined) {
      return {
        suggestions: [],
      };
    }

    var word = model.getWordUntilPosition(position);
    var range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    return {
      suggestions: this.tokenPragmaticIds
        .filter(
          (candidateToken) =>
            candidateToken.startsWith("'") && candidateToken.endsWith("'")
        )
        .map((genericToken) =>
          genericToken.substring(1, genericToken.length - 1)
        )
        .map((tokenPragmaticId) => ({
          label: tokenPragmaticId,
          insertText: tokenPragmaticId,
          kind: languages.CompletionItemKind.Keyword,
          range: range,
        })),
    };
  }
}
