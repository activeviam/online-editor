import React, { useEffect, useMemo, useRef } from "react";

import { useLocalStorage } from "react-use";
import { editor, IDisposable, Position } from "monaco-editor";
import { useMonaco, Monaco } from "@monaco-editor/react";

import { CustomTokensProvider } from "../CustomLanguageTokensProvider";
import { FHEditorProps, FullHeightEditor } from "./FullHeightEditor";
import { buildParsedTokensByLine } from "../RequestPostprocessing";
import {
  getTokenPragmaticDescription,
  SequentialThemeProvider,
  TokenizeThemeProvider,
} from "../TokenizeTheme";

import { ParsedCustomLanguage, TokenInfo } from "../Types/TokenizeTypes";

import "./Menu.css";

/*
Component containing a monaco editor whose custom content is presented
with color highlighting according to the user's grammar.
*/

interface IProps extends FHEditorProps {
  value: string;
  parsedCustomLanguage: ParsedCustomLanguage | undefined;
  themeProvider: TokenizeThemeProvider | undefined;
  setThemeProvider: (themeProvider: TokenizeThemeProvider | undefined) => void;
  defaultLanguage?: never;
  language?: never;
}

export const TokenizeEditor = (props: IProps) => {
  const [tokensByLineStringified, setTokensByLineStringified] = useLocalStorage<
    string
  >("tokensByLineStringified", "");

  const hoverDisposable = useRef<IDisposable | undefined>();
  const tokenProviderDisposable = useRef<IDisposable | undefined>();

  const monaco = useMonaco();

  const syntaxHighlightAndUpdateHover = useMemo(
    () => (monaco: Monaco, tokensByLine: Map<number, TokenInfo[]>) => {
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
        }
      );
      hoverDisposable.current = hoverDisposable_;
      monaco.editor.setTheme("customTheme");
    },
    [hoverDisposable, tokenProviderDisposable]
  );

  const { parsedCustomLanguage, setThemeProvider } = props;
  useEffect(() => {
    if (monaco !== null && parsedCustomLanguage !== undefined) {
      const currentTokensByLine = buildParsedTokensByLine(parsedCustomLanguage);
      if (currentTokensByLine !== undefined) {
        setTokensByLineStringified(
          JSON.stringify(Array.from(currentTokensByLine.entries()))
        );
      } else {
        setTokensByLineStringified(undefined);
      }

      const tokenPragmaticIds = parsedCustomLanguage.ruleNames;
      const colorPaletteId = "OneLightUI";
      if (tokenPragmaticIds.length > 0) {
        setThemeProvider(
          new SequentialThemeProvider(tokenPragmaticIds, colorPaletteId)
        );
      }
    }
  }, [
    monaco,
    parsedCustomLanguage,
    setThemeProvider,
    tokensByLineStringified,
    setTokensByLineStringified,
  ]);

  // Update syntax highlighting and hover when state changes.
  useEffect(() => {
    if (monaco === null) {
      return () => {};
    }

    monaco.languages.register({
      id: "customLanguage",
    });

    const rules =
      props.themeProvider !== undefined ? props.themeProvider.buildRules() : [];

    monaco.editor.defineTheme("customTheme", {
      base: "vs",
      inherit: false,
      rules: rules,
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
    props.themeProvider,
    monaco,
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
  }, []);

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
