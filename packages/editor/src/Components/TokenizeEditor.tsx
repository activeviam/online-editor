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

interface IProps extends FHEditorProps {
  value: string;
  parsedCustomLanguage: ParsedCustomLanguage | undefined;
  grammarResponse: GrammarRequestResult | undefined;
  defaultLanguage?: never;
  language?: never;
}

export const TokenizeEditor = (props: IProps) => {
  const [tokensByLine, setTokensByLine] = useLocalStorage<
    Map<number, TokenInfo[]>
  >("tokensByLine", new Map());

  const [themeRules, setThemeRules] = useLocalStorage<editor.ITokenThemeRule[]>(
    "themeRule",
    []
  );

  const [disposableHover, setDisposableHover] = useState<
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
      rules: [],
      colors: { "editorLineNumber.foreground": "ff0000" },
    });
    monaco.editor.setTheme("customTheme");

    if (tokensByLine && tokensByLine.size) {
      // reload previous state
      syntaxHighlightAndUpdateHover(monaco, tokensByLine);
    }
  };

  const syntaxHighlightAndUpdateHover = (
    monaco: Monaco,
    tokensByLine: Map<number, TokenInfo[]>
  ) => {
    console.log(tokensByLine);
    // Update Tokens
    monaco.languages.setTokensProvider(
      "customLanguage",
      new CustomTokensProvider(tokensByLine)
    );

    // Update Hover

    if (disposableHover !== undefined) {
      disposableHover.dispose();
    }

    const disposable = monaco.languages.registerHoverProvider(
      "customLanguage",
      {
        provideHover: (model, position) => {
          const { column, lineNumber } = position;

          const tokensCurrentLine = tokensByLine!.get(lineNumber);

          if (tokensCurrentLine === undefined) {
            return { contents: [] };
          } else if (tokensCurrentLine.length === 1) {
            return { contents: [{ value: tokensCurrentLine[0].type }] };
          }

          const correctToken = tokensCurrentLine
            .slice()
            .reverse()
            .find((candidate: TokenInfo) => candidate.column <= column);

          if (correctToken === undefined) {
            return { contents: [] };
          }

          return { contents: [{ value: correctToken.type }] };
        },
      }
    );
    setDisposableHover(disposable);
    monaco.editor.setTheme("customTheme");
  };

  useEffect(() => {
    if (monaco && props.grammarResponse) {
      console.log("Defining theme.");
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
      const tokensByLine = buildParsedTokensByLine(props.parsedCustomLanguage);
      const rules = buildTokenColorRulesRandom2(
        props.parsedCustomLanguage.ruleNames
      );
      setThemeRules(rules);
      monaco.editor.defineTheme("customTheme", {
        base: "vs",
        inherit: false,
        rules: rules,
        colors: {},
      });
      syntaxHighlightAndUpdateHover(monaco, tokensByLine);
      // Backup tokens in localStorage to recover state later
      setTokensByLine(tokensByLine);
    }
  }, [props.parsedCustomLanguage, monaco, setTokensByLine, setThemeRules]);

  // cleanup hover if there is one before exiting
  useEffect(() => {
    return () => {
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