import React, { useRef, useEffect, useState } from "react";

import Editor, { EditorProps, useMonaco } from "@monaco-editor/react";

export const GrammarMonacoEditor = (props: EditorProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    if (container.current) {
      setHeight(container.current.clientHeight);
    }
  }, []);

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({
        id: "antlr",
      });
      monaco.editor.defineTheme("grammarTheme", {
        base: "vs",
        inherit: false,
        rules: [],
        colors: { "editorLineNumber.foreground": "ff0000" },
      });
    }
  }, [monaco]);

  return (
    <div ref={container} style={{ height: "100%" }}>
      <Editor {...props} height={height} theme="grammarTheme" />
    </div>
  );
};
