import React, { useState } from "react";

/*
React component containing the grammar editor and buttons.
*/

import Editor from "@monaco-editor/react";
import { AppBar, Box, Tab, Tabs, Typography } from "@material-ui/core";

import { GrammarMenu } from "./GrammarMenu";
import { helloGrammar } from "../GrammarExamples/HelloGrammar";
import { uploadGrammar, uploadGrammarFromFile } from "../requests";

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const LeftPanel = () => {
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
            height="80vh"
            value={grammar}
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
