import React, { useState } from "react";

/*
React component containing the grammar editor and buttons.
*/

import Editor from "@monaco-editor/react";
import { AppBar, Tab, Tabs } from "@material-ui/core";

import { GrammarMenu } from "./GrammarMenu";
import { helloGrammar } from "../GrammarExamples/HelloGrammar";
import { uploadGrammar, uploadGrammarFromFile } from "../requests";
import { TabPanel } from "../Misc/TabPanel";

import "./Panes.css";

export const LeftPane = () => {
  const [grammar, setGrammar] = useState(helloGrammar);
  const [rootNode, setRootNode] = useState(""); // Grammar Root Node
  const [selectedFile, setSelectedFile] = useState<File>(); // Gramar File
  const [tabValue, setTabValue] = useState(0);

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
    setSelectedFile(file);
    if (selectedFile === undefined) {
      console.error("File is undefined.");
      return;
    }
    uploadGrammarFromFile(selectedFile, rootNode);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => {
            setTabValue(newValue);
          }}
        >
          <Tab label="Grammar"></Tab>
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <div className="editor">
          <Editor
            value={grammar}
            height="calc(0.85 * (100vh - 74px)"
            onChange={handleGrammarChange}
          ></Editor>
        </div>
      </TabPanel>
      <div className="grammar-menu">
        <GrammarMenu
          //onChangeVisitor={setVisitor}
          onChangeRootNode={setRootNode}
          onChangeFilePicker={handleFilePickChange}
          onClickCompileGrammar={handleCompileGrammarClick}
        ></GrammarMenu>
      </div>
    </div>
  );
};
