import React, { useRef, useEffect, useState } from "react";

import Editor, { EditorProps } from "@monaco-editor/react";

export const FullHeightEditor = (props: EditorProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    if (container.current) {
      setHeight(container.current.clientHeight);
    }
  }, []);

  return (
    <div ref={container} style={{ height: "100%" }}>
      <Editor {...props} height={height} />
    </div>
  );
};
