import React, { useEffect, useRef, useState } from "react";

import Editor, { EditorProps, Monaco } from "@monaco-editor/react";

import { editor } from "monaco-editor";

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

  const handleOnMountEditor = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    if (container.current) {
      setHeight(container.current.offsetHeight);
    }

    if (props.onMount) {
      props.onMount(editor, monaco);
    }
  };

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
      <Editor {...props} height={height} onMount={handleOnMountEditor}></Editor>
    </div>
  );
};
