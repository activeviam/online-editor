import React, { useState } from "react";

/*
React component containing the user defined language editor and button.
*/

import Editor from "@monaco-editor/react";
import { AppBar, Tab, Tabs } from "@material-ui/core";

import { parseUserDefinedLanguage } from "../requests";
import { UserDefinedLanguageMenu } from "./UserDefinedLanguageMenu";
import { TabPanel } from "../Misc/TabPanel";

import "./Panes.css";

export const RightPane = () => {
  const [userDefinedLanguage, setUserDefinedLanguage] = useState("hello bob");
  //const [visitor, setVisitor] = useState("Visitor Code");
  const [tabValue, setTabValue] = useState(0);

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
    <div>
      <AppBar position="static">
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => {
            setTabValue(newValue);
          }}
        >
          <Tab label="User Defined Language"></Tab>
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <div className="editor">
          <Editor
            height="calc(0.85 * (100vh - 74px)"
            onChange={handleUserDefinedLanguageChange}
            value={userDefinedLanguage}
          ></Editor>
        </div>
      </TabPanel>
      <div className="user-defined-language-menu">
        <UserDefinedLanguageMenu
          onClickParse={handleParseClick}
        ></UserDefinedLanguageMenu>
      </div>
    </div>
  );
};
