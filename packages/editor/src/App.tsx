import React, { useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";

import { GrammarMenu } from "@online-editor-2020/editor/src/Components/GrammarMenu";
import { UserDefinedLanguageMenu } from "@online-editor-2020/editor/src/Components/UserDefinedLanguageMenu";
import {
  uploadGrammar,
  uploadGrammarFromFile,
  parseUserDefinedLanguage,
} from "@online-editor-2020/editor/src/requests";

const App = () => {
  const [grammar, setGrammar] = useState("Your Grammar");
  const [userDefinedLanguage, setUserDefinedLanguage] = useState(
    "Your Language"
  );
  //const [visitor, setVisitor] = useState("Visitor Code");
  const [rootNode, setRootNode] = useState(""); // Grammar Root Node
  const [selectedFile, setSelectedFile] = useState<File>(); // Gramar File

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

  const handleCompileGrammarFromFileClick = () => {
    if (selectedFile === undefined) {
      console.error("File is undefined.");
      return;
    }
    uploadGrammarFromFile(selectedFile, rootNode);
  };

  const handleUserDefinedLanguageChange = (
    changedUserDefinedLanguage: string | undefined
  ) => {
    if (changedUserDefinedLanguage === undefined) {
      console.error("Undefined user defined language state.");
      return;
    }
    setUserDefinedLanguage(changedUserDefinedLanguage);
  };

  const handleParseClick = async () => {
    const parsed = await parseUserDefinedLanguage(userDefinedLanguage);
    console.log(parsed);
  };

  return (
    <div className="split-screen">
      <div className="left-pane">
        <div className="editor">
          <Editor
            height="85vh"
            value={grammar}
            onChange={handleGrammarChange}
          ></Editor>
        </div>
        <div className="grammar-menu">
          <GrammarMenu
            //onChangeVisitor={setVisitor}
            onChangeRootNode={setRootNode}
            onChangeFilePicker={setSelectedFile}
            onClickCompileGrammar={handleCompileGrammarClick}
            onClickCompileGrammarFromFile={handleCompileGrammarFromFileClick}
          ></GrammarMenu>
        </div>
      </div>
      <div className="right-pane">
        <div className="editor">
          <Editor
            height="85vh"
            onChange={handleUserDefinedLanguageChange}
            value={userDefinedLanguage}
          ></Editor>
        </div>
        <div className="user-defined-language-menu">
          <UserDefinedLanguageMenu
            onClickParse={handleParseClick}
          ></UserDefinedLanguageMenu>
        </div>
      </div>
    </div>
  );
};

export default App;
