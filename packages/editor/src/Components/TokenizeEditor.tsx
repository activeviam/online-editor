import React, { useEffect, useState } from "react";

import { useLocalStorage } from "react-use";
import { editor, IDisposable } from "monaco-editor";
import { useMonaco, Monaco } from "@monaco-editor/react";

import { CustomTokensProvider } from "../CustomLanguageTokensProvider";
import {
  buildTokenColorRulesRandom,
  buildTokenColorRulesRandom2,
} from "../TokenizeTheme";
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

  const [disposableHover, setDisposableHover] = useState<
    IDisposable | undefined
  >();

  const [disposableTokenProvider, setDisposableTokenProvider] = useState<
    IDisposable | undefined
  >();
  const monaco = useMonaco();

  const handleOnMountEditor = (
    _editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
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

    if (tokensByLine.size) {
      // reload previous state
      syntaxHighlightAndUpdateHover(monaco, tokensByLine);
    }
  };

  const syntaxHighlightAndUpdateHover = (
    monaco: Monaco,
    tokensByLine: Map<number, TokenInfo[]>
  ) => {
    if (tokensByLine === undefined || monaco === null) {
      return;
    }

    // Update Tokens
    if (disposableTokenProvider !== undefined) {
      disposableTokenProvider.dispose();
    }
    const tokenProviderDisposable_ = monaco.languages.setTokensProvider(
      "customLanguage",
      new CustomTokensProvider(tokensByLine)
    );
    setDisposableTokenProvider(tokenProviderDisposable_);

    // Update Hover

    if (disposableHover !== undefined) {
      disposableHover.dispose();
    }

    const hoverDisposable_ = monaco.languages.registerHoverProvider(
      "customLanguage",
      {
        provideHover: (
          model: any,
          position: { column: any; lineNumber: any }
        ) => {
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
            .find((candidate: TokenInfo) => candidate.column <= column);

          if (correctToken === undefined) {
            return { contents: [] };
          }

          return { contents: [{ value: getTokenHoverText(correctToken) }] };
        },
      }
    );
    setDisposableHover(hoverDisposable_);
    monaco.editor.setTheme("customTheme");
  };

  useEffect(() => {
    if (monaco && props.grammarResponse) {
      monaco.editor.defineTheme("customTheme", {
        base: "vs",
        inherit: false,
        rules: buildTokenColorRulesRandom(props.grammarResponse),
        colors: {},
      });
    }
  }, [props.grammarResponse, monaco]);

  useEffect(() => {
    if (monaco && props.parsedCustomLanguage) {
      const rules = buildTokenColorRulesRandom2(
        props.parsedCustomLanguage.ruleNames
      );
      setThemeRules(rules);
      monaco.editor.defineTheme("customTheme", {
        base: "vs",
        inherit: false,
        rules: rules,
        colors: { "editorLineNumber.foreground": "ff0000" },
      });

      const currentTokensByLine = buildParsedTokensByLine(
        props.parsedCustomLanguage
      );
      if (currentTokensByLine !== undefined) {
        syntaxHighlightAndUpdateHover(monaco, currentTokensByLine);
        setTokensByLineStringified(
          JSON.stringify(Array.from(currentTokensByLine.entries()))
        );
      }
    }
  }, [
    props.parsedCustomLanguage,
    monaco,
    setThemeRules,
    setTokensByLineStringified,
  ]); // TODO: Fix Dependencies

  // cleanup token provider and hover if there is one before exiting
  useEffect(() => {
    return () => {
      if (disposableTokenProvider) {
        disposableTokenProvider.dispose();
      }
      if (disposableHover) {
        disposableHover.dispose();
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
      onMount={handleOnMountEditor}
    />
  );
};
