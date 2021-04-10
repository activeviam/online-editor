import React, { useEffect, useMemo, useRef } from "react";

import { useLocalStorage } from "react-use";
import { IDisposable } from "monaco-editor";
import { useMonaco, Monaco } from "@monaco-editor/react";

import { CustomTokensProvider } from "../TokenizeLogic/CustomLanguageTokensProvider";
import { FHEditorProps, FullHeightEditor } from "./FullHeightEditor";
import { buildParsedTokensByLine } from "../RequestPostprocessing";
import { getTokenizeHoverProvider } from "../TokenizeLogic/TokenizeHoverProvider";
import { TokenizeThemeProvider } from "../TokenizeTheme";

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
      const tokenProviderDisposable_ = monaco.languages.setTokensProvider(
        "customLanguage",
        new CustomTokensProvider(tokensByLine)
      );

      if (tokenProviderDisposable.current !== undefined) {
        tokenProviderDisposable.current.dispose();
      }

      tokenProviderDisposable.current = tokenProviderDisposable_;

      // Update Hover
      const hoverProvider = getTokenizeHoverProvider(tokensByLine);
      const hoverDisposable_ = monaco.languages.registerHoverProvider(
        "customLanguage",
        hoverProvider
      );
      if (hoverDisposable.current !== undefined) {
        hoverDisposable.current.dispose();
      }

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
