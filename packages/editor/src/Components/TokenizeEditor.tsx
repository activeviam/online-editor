import React, { useEffect } from "react";

import { useLocalStorage } from "react-use";
import { editor } from "monaco-editor";
import { useMonaco, Monaco } from "@monaco-editor/react";

import { CustomTokensProvider } from "../CustomLanguageTokensProvider";
import { buildTokenColorRulesRandom } from "../CustomTokenTheme";
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
      tokenizeAndUpdateHover(monaco, tokensByLine);
    }
  };

  const tokenizeAndUpdateHover = (
    monaco: Monaco,
    tokensByLine: Map<number, TokenInfo[]>
  ) => {
    // Update Tokens
    monaco.languages.setTokensProvider(
      "customLanguage",
      new CustomTokensProvider(tokensByLine)
    );
    monaco.editor.setTheme("customTheme");

    // Update Hover
    monaco.languages.registerHoverProvider("customLanguage", {
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
          .find((candidate: TokenInfo) => candidate.start <= column);

        if (correctToken === undefined) {
          return { contents: [] };
        }

        return { contents: [{ value: correctToken.type }] };
      },
    });
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
      tokenizeAndUpdateHover(monaco, tokensByLine);
      // Backup tokens in localStorage to recover state later
      setTokensByLine(tokensByLine);
    }
  }, [props.parsedCustomLanguage, monaco, setTokensByLine]);

  return (
    <FullHeightEditor
      {...props}
      defaultLanguage={"customLanguage"}
      theme="customTheme"
      loading={props.loading ? props.loading : ""}
      onMount={handleOnMountEditor}
    />
  );
};
