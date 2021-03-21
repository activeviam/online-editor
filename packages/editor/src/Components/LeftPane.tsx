import React from "react";

/*
React component containing the grammar editor and buttons.
*/

import { AppBar, Tab, Tabs } from "@material-ui/core";

import { CustomLanguageTools } from "./CustomLanguageTools";
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
          borderRadius: "16px",
        }}
      >
        <Tabs
          value={props.tabValue}
          onChange={(event, newValue) => {
            props.setTabValue(newValue);
          }}
        >
          <Tab label="Grammar" />
          <Tab label="Parse Language" />
          <Tab label="Visitor" />
        </Tabs>
      </AppBar>
      <TabPanel value={props.tabValue} index={0}>
        <GrammarTools setGrammarResponse={props.setGrammarResponse} />
      </TabPanel>
      <TabPanel value={props.tabValue} index={1}>
        <CustomLanguageTools grammarResponse={props.grammarResponse} />
      </TabPanel>
      <TabPanel value={props.tabValue} index={2}>
        <h3>Not yet implemented.</h3>
      </TabPanel>
    </div>
  );
};
