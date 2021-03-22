import React, { useRef, useEffect, useState } from "react";

import Editor, { EditorProps } from "@monaco-editor/react";

export const GrammarMonacoEditor = (props: EditorProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    if (container.current) {
      setHeight(container.current.clientHeight);
    }
  }, []);

  return (
    <div ref={container} style={{ height: "100%" }}>
      <Editor
        {...props}
        height={height}
        language="antlr"
        loading=""
        onMount={(editor, monaco) => {
          if (monaco) {
            monaco.editor.defineTheme("grammarTheme", {
              base: "vs",
              inherit: false,
              rules: [],
              colors: { "editorLineNumber.foreground": "ff0000" },
            });
            monaco.editor.setTheme("grammarTheme");
          }
        }}
      />
    </div>
  );
};
