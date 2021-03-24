import React from "react";

/*
React component containing the grammar editor and buttons.
*/

import { AppBar, Tab, Tabs } from "@material-ui/core";

import { TokenizeTools } from "./TokenizeTools";
import { GrammarTools } from "./GrammarTools";
import { TabPanel } from "../Misc/TabPanel";

import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./Panes.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
  setGrammarResponse: (response: GrammarRequestResult) => void;
  tabValue: number;
  setTabValue: (tabValue: number) => void;
}

export const LeftPane = (props: IProps) => {
  return (
    <div className="whole-pane">
      <AppBar
        position="static"
        color="transparent"
        style={{
          paddingLeft: "24px",
          paddingRight: "24px",
          borderRadius: "4px",
        }}
      >
        <Tabs
          value={props.tabValue}
          onChange={(event, newValue) => {
            props.setTabValue(newValue);
          }}
        >
          <Tab label="ANTLR Grammar" />
          <Tab label="Tokenize Input" />
          <Tab label="Implement Visitor" />
        </Tabs>
      </AppBar>
      <TabPanel value={props.tabValue} index={0}>
        <GrammarTools setGrammarResponse={props.setGrammarResponse} />
      </TabPanel>
      <TabPanel value={props.tabValue} index={1}>
        <TokenizeTools grammarResponse={props.grammarResponse} />
      </TabPanel>
      <TabPanel value={props.tabValue} index={2}>
        <h3>Not yet implemented.</h3>
      </TabPanel>
    </div>
  );
};
