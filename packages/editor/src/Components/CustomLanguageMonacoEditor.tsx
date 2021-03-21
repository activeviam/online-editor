import React, { useEffect, useRef, useState } from "react";

import Editor, { EditorProps, useMonaco } from "@monaco-editor/react";

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

const mockGrammarRequestResult: GrammarRequestResult = {
  allPossibleTokens: ["ADD", "TODO", "COMPLETE", "STRING", "EOL", "WS"],
};

const mockParseResult: ParsedCustomLanguage = {
  ruleNames: ["ADD", "TODO", "COMPLETE", "STRING", "EOL", "WS"],
  code: 'ADD TODO "Create an editor"\n',
  tokens: [
    {
      text: "ADD",
      type: "ADD",
      line: 1,
      start: 0,
      stop: 2,
    },
    {
      text: "TODO",
      type: "TODO",
      line: 1,
      start: 4,
      stop: 7,
    },
    {
      text: '"Create an editor"',
      type: "STRING",
      line: 1,
      start: 9,
      stop: 26,
    },
    {
      text: "\n",
      type: "EOL",
      line: 1,
      start: 27,
      stop: 27,
    },
    {
      text: "ADD",
      type: "ADD",
      line: 2,
      start: 0,
      stop: 2,
    },
    {
      text: "TODO",
      type: "TODO",
      line: 2,
      start: 4,
      stop: 7,
    },
    {
      text: '"foo"',
      type: "STRING",
      line: 2,
      start: 9,
      stop: 14,
    },
    {
      text: "\n",
      type: "EOL",
      line: 2,
      start: 15,
      stop: 15,
    },
  ],
};

interface IProps extends EditorProps {
  value: string;
  parsedCustomLanguage: ParsedCustomLanguage | undefined;
  grammarResponse: GrammarRequestResult | undefined;
  defaultLanguage?: never;
}

export const CustomLanguageMonacoEditor = (props: IProps) => {
  const [mockGrammar, setMockGrammar] = useState(false);
  const [mockParse, setMockParse] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    if (container.current) {
      setHeight(container.current.clientHeight);
    }
  }, []);

  const monaco = useMonaco();

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
    setMockGrammar(false);
  }, [props.grammarResponse, monaco]);

  useEffect(() => {
    if (monaco && props.parsedCustomLanguage) {
      console.log("Defining provider.");
      monaco.languages.setTokensProvider(
        "customLanguage",
        new CustomTokensProvider(props.parsedCustomLanguage)
      );
      monaco.editor.setTheme("customTheme");

      const tokensByLine = buildParsedTokensByLine(props.parsedCustomLanguage);
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
    }
    setMockParse(false);
  }, [props.parsedCustomLanguage, monaco]);

  return (
    <div ref={container} style={{ height: "100%" }}>
      <Editor
        {...props}
        defaultLanguage={"customLanguage"}
        height={height}
        theme="customTheme"
        onMount={(editor, monaco) => {
          if (monaco) {
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
          }
        }}
      />
    </div>
  );
};

/*    To mock input if needed (need to also change useEffects above)

      <div className="divider"></div>
      <Button variant="text" onClick={() => setMockGrammar(true)}>
        Mock Grammar
      </Button>
      <div className="divider"></div>
      <Button variant="text" onClick={() => setMockParse(true)}>
        Mock Parse
      </Button>
*/
