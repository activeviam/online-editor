import React, { useEffect, useMemo, useRef } from "react";

import { useLocalStorage, useEffectOnce } from "react-use";
import { IDisposable } from "monaco-editor";
import { useMonaco, Monaco } from "@monaco-editor/react";

import { CustomTokensProvider } from "../TokenizeLogic/CustomLanguageTokensProvider";
import { FHEditorProps, FullHeightEditor } from "./FullHeightEditor";
import { buildParsedTokensByLine } from "../RequestPostprocessing";
import { CustomLanguageCompletionItemProvider } from "../TokenizeLogic/completionProvider";
import { getTokenizeHoverProvider } from "../TokenizeLogic/TokenizeHoverProvider";
import {
  CustomThemeProvider,
  SequentialThemeProvider,
  ThemeMode,
} from "../TokenizeTheme";

import { GrammarRequestResult } from "../Types/GrammarTypes";
import { ParsedCustomLanguage, TokenInfo } from "../Types/TokenizeTypes";

import "./Menu.css";

/*
Component containing a monaco editor whose custom content is presented
with color highlighting according to the user's grammar.
*/

interface IProps extends FHEditorProps {
  value: string;
  grammarResponse: GrammarRequestResult | undefined;
  customThemeProvider: CustomThemeProvider;
  sequentialThemeProvider: SequentialThemeProvider | undefined;
  parsedCustomLanguage: ParsedCustomLanguage | undefined;
  themeMode: ThemeMode | undefined;
  defaultLanguage?: never;
  language?: never;
}

export const TokenizeEditor = (props: IProps) => {
  const [tokensByLineStringified, setTokensByLineStringified] = useLocalStorage<
    string
  >("tokensByLineStringified", "");

  const hoverDisposable = useRef<IDisposable | undefined>();
  const tokenProviderDisposable = useRef<IDisposable | undefined>();
  const completionDisposable = useRef<IDisposable | undefined>();

  const tokenProvider = useRef<CustomTokensProvider>();

  const monaco = useMonaco();

  const syntaxHighlightAndUpdateHover = useMemo(
    () => (monaco: Monaco, tokensByLine: Map<number, TokenInfo[]>) => {
      if (tokensByLine === undefined || monaco === null) {
        return;
      }

      // Update Tokens
      if (tokenProvider.current) {
        tokenProvider.current.tokensByLine = tokensByLine;
      }

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
    },
    [hoverDisposable]
  );

  const { parsedCustomLanguage } = props;
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
    tokensByLineStringified,
    setTokensByLineStringified,
  ]);

  // Update syntax highlighting and hover with new theme or tokens
  const { sequentialThemeProvider, customThemeProvider, themeMode } = props;
  useEffect(() => {
    if (monaco === null) {
      return () => {};
    }

    const selectedThemeProvider =
      themeMode === ThemeMode.Sequential
        ? sequentialThemeProvider
        : customThemeProvider;

    const rules =
      selectedThemeProvider !== undefined
        ? selectedThemeProvider.buildRules()
        : [];

    monaco.editor.defineTheme("customTheme", {
      base: "vs",
      inherit: false,
      rules: rules,
      colors: { "editorLineNumber.foreground": "ff0000" },
    });

    monaco.editor.setTheme("customTheme");

    const tokensByLine = deserializeTokensByLine(tokensByLineStringified);

    if (tokensByLine.size > 0) {
      syntaxHighlightAndUpdateHover(monaco, tokensByLine);
    }
  }, [
    sequentialThemeProvider,
    customThemeProvider,
    themeMode,
    monaco,
    tokensByLineStringified,
    syntaxHighlightAndUpdateHover,
  ]);

  useEffect(() => {
    if (monaco !== null && props.grammarResponse !== undefined) {
      completionDisposable.current = monaco.languages.registerCompletionItemProvider(
        "customLanguage",
        new CustomLanguageCompletionItemProvider(props.grammarResponse.tokens)
      );

      return () => {
        if (completionDisposable.current !== undefined) {
          completionDisposable.current.dispose();
        }
      };
    }
  }, [monaco, props.grammarResponse]);

  useEffectOnce(() => {
    if (monaco !== null) {
      monaco.languages.register({
        id: "customLanguage",
      });

      const tokensByLine = deserializeTokensByLine(tokensByLineStringified);
      tokenProvider.current = new CustomTokensProvider(tokensByLine);
      tokenProviderDisposable.current = monaco.languages.setTokensProvider(
        "customLanguage",
        tokenProvider.current
      );
    }
    return () => {
      if (tokenProviderDisposable.current) {
        tokenProviderDisposable.current.dispose();
      }
      if (hoverDisposable.current) {
        hoverDisposable.current.dispose();
      }
      if (completionDisposable.current) {
        completionDisposable.current.dispose();
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

const deserializeTokensByLine = (
  tokensByLineStringified: string | undefined
) => {
  const tokensByLine: Map<number, TokenInfo[]> = tokensByLineStringified
    ? new Map(JSON.parse(tokensByLineStringified))
    : new Map();
  return tokensByLine;
};
