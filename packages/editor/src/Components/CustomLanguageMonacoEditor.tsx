import React, { useEffect, useRef, useState } from "react";

import useLocalStorage from "react-use-localstorage";
import { editor } from "monaco-editor";
import Editor, { EditorProps, useMonaco, Monaco } from "@monaco-editor/react";

import { CustomTokensProvider } from "../CustomLanguageTokensProvider";
import { buildTokenColorRulesRandom } from "../CustomTokenTheme";
import { buildParsedTokensByLine } from "../RequestPostprocessing";

import { GrammarRequestResult } from "../Types/GrammarTypes";
import { ParsedCustomLanguage, TokenInfo } from "../Types/CustomLanguageTypes";

import "./TokenStyling.css";
import "./Menu.css";

/*
Component containing a monaco editor whose custom content is presented
with color highlighting according to the user's grammar.
*/

interface IProps extends EditorProps {
  value: string;
  parsedCustomLanguage: ParsedCustomLanguage | undefined;
  grammarResponse: GrammarRequestResult | undefined;
  defaultLanguage?: never;
}

export const CustomLanguageMonacoEditor = (props: IProps) => {
  const [tokensByLineStringified, setTokensByLineStringified] = useLocalStorage(
    "tokensByLineStringified",
    "notSet"
  );
  const monaco = useMonaco();

  const handleMonacoOnMount = (
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

    if (tokensByLineStringified !== "notSet") {
      // reload previous state
      const tokensByLine = new Map<number, TokenInfo[]>(
        JSON.parse(tokensByLineStringified)
      );
      tokenizeAndUpdateHover(monaco, tokensByLine);
    }
  };

  const tokenizeAndUpdateHover = (
    monaco: Monaco,
    tokensByLine: Map<number, TokenInfo[]>
  ) => {
    // Update Theme
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

  const container = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    if (container.current) {
      setHeight(container.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    if (monaco && props.grammarResponse) {
      console.log("Defining theme.");
      monaco.editor.defineTheme("customTheme", {
        base: "vs",
        inherit: false,
        rules: buildTokenColorRulesRandom(props.grammarResponse),
        colors: {},
      });
      // next line is to override previous theme if there was one.
      //monaco.editor.setTheme("notOurCustomLanguage");
    }
  }, [props.grammarResponse, monaco]);

  useEffect(() => {
    if (monaco && props.parsedCustomLanguage) {
      const tokensByLine = buildParsedTokensByLine(props.parsedCustomLanguage);
      tokenizeAndUpdateHover(monaco, tokensByLine);
      return () => {
        // Backup tokens in localStorage to recover state later
        setTokensByLineStringified(JSON.stringify(Array.from(tokensByLine)));
      };
    }
  }, [props.parsedCustomLanguage, monaco, setTokensByLineStringified]);

  return (
    <div ref={container} style={{ height: "100%" }}>
      <Editor
        {...props}
        defaultLanguage={"customLanguage"}
        height={height}
        theme="customTheme"
        loading=""
        onMount={handleMonacoOnMount}
      />
    </div>
  );
};
