import React from "react";

import { Registry } from "monaco-textmate";
import { wireTmGrammars } from "monaco-editor-textmate";
import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

import { FHEditorProps, FullHeightEditor } from "./FullHeightEditor";
import { AntlrSyntax } from "../antlr-textmate/AntlrSyntax";
import { AntlrCompleteLightTheme } from "../antlr-textmate/CompleteLightTheme";

interface IProps extends FHEditorProps {
  language?: never;
  value: string | undefined;
  setGrammar: (newGrammar: string) => void;
}

export const GrammarEditor = (props: IProps) => {
  const liftOff = async (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    const registry = new Registry({
      getGrammarDefinition: async () => {
        return {
          format: "json",
          content: AntlrSyntax,
        };
      },
    });

    // map of monaco "language id's" to TextMate scopeNames
    const grammars = new Map();
    grammars.set("ANTLR4", "source.antlr");

    await wireTmGrammars(monaco, registry, grammars, editor);
  };

  const handleOnMount = async (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    if (monaco) {
      monaco.languages.register({
        id: "ANTLR4",
      });

      monaco.editor.defineTheme("ANTLRTheme", AntlrCompleteLightTheme);
      monaco.editor.setTheme("ANTLRTheme");
      await liftOff(editor, monaco);
    }
  };

  return (
    <FullHeightEditor
      {...props}
      onMount={handleOnMount}
      language="ANTLR4"
      defaultLanguage="ANTLR4"
      theme="ANTLRTheme"
      loading={props.loading ? props.loading : ""}
    />
  );
};
