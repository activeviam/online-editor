import React, { useCallback, useEffect, useRef } from "react";

import { useLocalStorage } from "react-use";
import { editor, IDisposable, Position } from "monaco-editor";
import { useMonaco, Monaco } from "@monaco-editor/react";

import { CustomTokensProvider } from "../CustomLanguageTokensProvider";
import { buildTokenColorRulesRandom } from "../TokenizeTheme";
import { FHEditorProps, FullHeightEditor } from "./FullHeightEditor";
import { buildParsedTokensByLine } from "../RequestPostprocessing";

import { GrammarRequestResult } from "../Types/GrammarTypes";
import { ParsedCustomLanguage, TokenInfo } from "../Types/TokenizeTypes";

import "./Menu.css";

/*
Component containing a monaco editor whose custom content is presented
with color highlighting according to the user's grammar.
*/

const getTokenHoverText = (token: TokenInfo): string => {
  const hoverValue = token.type.startsWith("T__")
    ? `'${token.text}'`
    : token.type;
  return hoverValue;
};

interface IProps extends FHEditorProps {
  value: string;
  parsedCustomLanguage: ParsedCustomLanguage | undefined;
  grammarResponse: GrammarRequestResult | undefined;
  defaultLanguage?: never;
  language?: never;
}

export const TokenizeEditor = (props: IProps) => {
  const [tokensByLineStringified, setTokensByLineStringified] = useLocalStorage<
    string
  >("tokensByLineStringified", "");

  const [themeRules, setThemeRules] = useLocalStorage<editor.ITokenThemeRule[]>(
    "themeRule",
    []
  );

  const hoverDisposable = useRef<IDisposable | undefined>();
  const tokenProviderDisposable = useRef<IDisposable | undefined>();

  const monaco = useMonaco();

  const syntaxHighlightAndUpdateHover = useCallback(
    (monaco: Monaco, tokensByLine: Map<number, TokenInfo[]>) => {
      if (tokensByLine === undefined || monaco === null) {
        return;
      }

      // Update Tokens
      if (tokenProviderDisposable.current !== undefined) {
        tokenProviderDisposable.current.dispose();
      }

      const tokenProviderDisposable_ = monaco.languages.setTokensProvider(
        "customLanguage",
        new CustomTokensProvider(tokensByLine)
      );
      tokenProviderDisposable.current = tokenProviderDisposable_;

      // Update Hover
      if (hoverDisposable.current !== undefined) {
        hoverDisposable.current.dispose();
      }

      const hoverDisposable_ = monaco.languages.registerHoverProvider(
        "customLanguage",
        {
          provideHover: (model: editor.ITextModel, position: Position) => {
            const { column, lineNumber } = position;

            const tokensCurrentLine = tokensByLine.get(lineNumber);

            if (tokensCurrentLine === undefined) {
              return { contents: [] };
            } else if (tokensCurrentLine.length === 1) {
              return {
                contents: [{ value: getTokenHoverText(tokensCurrentLine[0]) }],
              };
            }

            const correctToken = tokensCurrentLine
              .slice()
              .reverse()
              .find((candidate: TokenInfo) => candidate.column < column);

            if (correctToken === undefined) {
              return { contents: [] };
            }

            return { contents: [{ value: getTokenHoverText(correctToken) }] };
          },
        }
      );
      hoverDisposable.current = hoverDisposable_;
      monaco.editor.setTheme("customTheme");
    },
    [hoverDisposable, tokenProviderDisposable]
  );

  useEffect(() => {
    if (monaco !== null && props.grammarResponse !== undefined) {
      const rules = buildTokenColorRulesRandom(props.grammarResponse);
      setThemeRules(rules);
    }
  }, [props.grammarResponse, monaco, setThemeRules]);

  useEffect(() => {
    if (monaco !== null && props.parsedCustomLanguage !== undefined) {
      const currentTokensByLine = buildParsedTokensByLine(
        props.parsedCustomLanguage
      );
      if (currentTokensByLine !== undefined) {
        setTokensByLineStringified(
          JSON.stringify(Array.from(currentTokensByLine.entries()))
        );
      } else {
        setTokensByLineStringified(undefined);
      }
    }
  }, [props.parsedCustomLanguage, monaco, setTokensByLineStringified]);

  // Update syntax highlighting and hover when state changes.
  useEffect(() => {
    if (monaco === null) {
      return () => {};
    }
    monaco.languages.register({
      id: "customLanguage",
    });

    monaco.editor.defineTheme("customTheme", {
      base: "vs",
      inherit: false,
      rules: themeRules || [],
      colors: { "editorLineNumber.foreground": "ff0000" },
    });

    monaco.editor.setTheme("customTheme");

    const tokensByLine: Map<number, TokenInfo[]> = tokensByLineStringified
      ? new Map(JSON.parse(tokensByLineStringified))
      : new Map();

    if (tokensByLine.size > 0) {
      syntaxHighlightAndUpdateHover(monaco, tokensByLine);
    }
  }, [
    monaco,
    themeRules,
    tokensByLineStringified,
    syntaxHighlightAndUpdateHover,
  ]);

  // cleanup token provider and hover if there is one before exiting
  useEffect(() => {
    return () => {
      if (tokenProviderDisposable.current) {
        tokenProviderDisposable.current.dispose();
      }
      if (hoverDisposable.current) {
        hoverDisposable.current.dispose();
      }
    };
  });

  return (
    <FullHeightEditor
      {...props}
      language={"customLanguage"}
      defaultLanguage={"customLanguage"}
      theme="customTheme"
      loading={props.loading ? props.loading : ""}
    />
  );
};
