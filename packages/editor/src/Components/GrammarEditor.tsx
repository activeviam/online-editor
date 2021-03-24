import React from "react";

import { Monaco } from "@monaco-editor/react";
import { FHEditorProps, FullHeightEditor } from "./FullHeightEditor";
import { editor } from "monaco-editor";

interface IProps extends FHEditorProps {
  language?: never;
}

export const GrammarEditor = (props: IProps) => {
  const handleOnMountEditor = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    if (monaco) {
      monaco.editor.defineTheme("grammarTheme", {
        base: "vs",
        inherit: false,
        rules: [],
        colors: { "editorLineNumber.foreground": "ff0000" },
      });
      monaco.editor.setTheme("grammarTheme");
    }
  };

  return (
    <FullHeightEditor
      {...props}
      language="antlr"
      loading={props.loading ? props.loading : ""}
      onMount={handleOnMountEditor}
    />
  );
};
