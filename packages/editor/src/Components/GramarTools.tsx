import React, { useState } from "react";

import { helloGrammar } from "../GrammarExamples/HelloGrammar";
import { uploadGrammar, uploadGrammarFromFile } from "../requests";
import { FullHeightEditor } from "./FullHeightEditor";
import { GrammarMenu } from "./GrammarMenu";

import "./Panes.css";

export const GramarTools = () => {
  const [grammar, setGrammar] = useState(helloGrammar);
  const [rootNode, setRootNode] = useState("root"); // Grammar Root Node

  const handleGrammarChange = (changedGrammar: string | undefined) => {
    if (changedGrammar === undefined) {
      console.error("Undefined grammar state.");
      return;
    }
    setGrammar(changedGrammar);
  };

  const handleCompileGrammarClick = () => {
    uploadGrammar(grammar, rootNode);
  };

  const handleFilePickChange = (file: File) => {
    if (file === undefined) {
      console.error("File is undefined.");
      return;
    }
    uploadGrammarFromFile(file, rootNode);
  };

  return (
    <div className="whole-pane">
      <div className="editor">
        <FullHeightEditor value={grammar} onChange={handleGrammarChange} />
      </div>
      <div className="grammar-menu">
        <GrammarMenu
          //onChangeVisitor={setVisitor}
          onChangeRootNode={setRootNode}
          onChangeFilePicker={handleFilePickChange}
          onClickCompileGrammar={handleCompileGrammarClick}
        />
      </div>
    </div>
  );
};
