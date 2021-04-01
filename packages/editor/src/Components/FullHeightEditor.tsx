import React, { useEffect, useRef, useState } from "react";

import Editor, { EditorProps } from "@monaco-editor/react";

/*
Monaco Editor instance that resizes automatically, adjusting height
to be 100% of parent.
*/

export interface FHEditorProps extends EditorProps {
  height?: never;
}

export const FullHeightEditor = (props: EditorProps) => {
  const [height, setHeight] = useState<number>(0);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      setHeight(container.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    if (!container.current) {
      return () => {};
    }

    const handleResize = () => {
      if (container.current) {
        setHeight(container.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [container]);

  return (
    <div ref={container} style={{ height: "100%" }}>
      <Editor {...props} height={height} />
    </div>
  );
};
