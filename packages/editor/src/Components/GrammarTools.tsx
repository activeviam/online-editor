import React from "react";

/*
Component that contains the grammar editor and its menu.
*/

import useLocalStorage from "react-use-localstorage";

import { helloGrammar } from "../GrammarExamples/HelloGrammar";
import { uploadGrammar, uploadGrammarFromFile } from "../requests";
import { FullHeightEditor } from "./FullHeightEditor";
import { GrammarMenu } from "./GrammarMenu";

import "./Panes.css";

interface IProps {
  setGrammarResponse: any; // TODO: replace for right type
}

export const GrammarTools = (props: IProps) => {
  const [grammar, setGrammar] = useLocalStorage("userGrammar", helloGrammar);
  const [grammarRoot, setGrammarRoot] = useLocalStorage("grammarRoot", "root"); // Grammar Root Node

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
    const grammarResponse = uploadGrammar(grammar, grammarRoot);
    props.setGrammarResponse(grammarResponse);
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
      <div className="grammar-menu">
        <GrammarMenu
          //onChangeVisitor={setVisitor}
          grammarRoot={grammarRoot}
          onChangeRootNode={setGrammarRoot}
          onChangeFilePicker={handleFilePickChange}
          onClickCompileGrammar={handleCompileGrammarClick}
        />
      </div>
      <div className="editor">
        <FullHeightEditor value={grammar} onChange={handleGrammarChange} />
      </div>
    </div>
  );
};
