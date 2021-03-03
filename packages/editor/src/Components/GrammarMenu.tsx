import React, { useState } from "react";

import "./Menu.css";

import {
  uploadGrammar,
  uploadGrammarFromFile,
} from "@online-editor-2020/editor/src/requests";

interface IProps {
  //onChangeVisitor: (visitor: string) => void;
  grammar: string;
}

export const GrammarMenu = (props: IProps) => {
  const [selectedFile, setSelectedFile] = useState<File>();

  const uploadGrammarOnClickHandler = () => {
    uploadGrammar(props.grammar);
    //.then(([visitor]) => {
    //  props.onChangeVisitor(visitor);
    //})
    //.catch(console.log);
  };

  const uploadGrammarFromFileOnClickHandler = () => {
    if (selectedFile === undefined) {
      console.error("File is undefined.");
      return;
    }
    uploadGrammarFromFile(selectedFile);
    //.then(props.onChangeVisitor)
    //.catch(console.log);
  };

  const filePickerOnChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files === null) {
      console.error("No file selected.");
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="menu">
      <button>Export Project</button>
      <div className="divider"></div>
      <input
        type="file"
        name="file"
        onChange={filePickerOnChangeHandler}
      ></input>
      <div className="divider"></div>
      <button onClick={uploadGrammarFromFileOnClickHandler}>
        Compile Grammar from File
      </button>
      <div className="divider"></div>
      <button onClick={uploadGrammarOnClickHandler}>Compile Grammar</button>
    </div>
  );
};
