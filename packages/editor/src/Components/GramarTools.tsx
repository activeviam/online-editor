import React, { useState } from "react";

/*
Component that contains the grammar editor and its menu.
*/

import { helloGrammar } from "../GrammarExamples/HelloGrammar";
import { uploadGrammar, uploadGrammarFromFile } from "../requests";
import { FullHeightEditor } from "./FullHeightEditor";
import { GrammarMenu } from "./GrammarMenu";

import "./Panes.css";

export const GramarTools = () => {
  const [grammar, setGrammar] = useState(helloGrammar);
  const [grammarRoot, setGrammarRoot] = useState("root"); // Grammar Root Node

  const handleGrammarChange = (changedGrammar: string | undefined) => {
    if (changedGrammar === undefined) {
      console.error("Undefined grammar state.");
      return;
    }
    setGrammar(changedGrammar);
  };

  const handleCompileGrammarClick = () => {
    if (grammarRoot === "") {
      console.error("No Grammar Root defined.");
      return;
    }
    uploadGrammar(grammar, grammarRoot);
  };

  const handleFilePickChange = (file: File) => {
    if (file === undefined) {
      console.error("File is undefined.");
      return;
    } else if (grammarRoot === "") {
      console.error("No Grammar Root defined.");
      return;
    }
    uploadGrammarFromFile(file, grammarRoot);
  };

  return (
    <div className="whole-pane">
      <div className="editor">
        <FullHeightEditor value={grammar} onChange={handleGrammarChange} />
      </div>
      <div className="grammar-menu">
        <GrammarMenu
          //onChangeVisitor={setVisitor}
          grammarRoot={grammarRoot}
          onChangeRootNode={setGrammarRoot}
          onChangeFilePicker={handleFilePickChange}
          onClickCompileGrammar={handleCompileGrammarClick}
        />
      </div>
    </div>
  );
};
