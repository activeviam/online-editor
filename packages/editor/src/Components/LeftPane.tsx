import React, { useState } from "react";

/*
React component containing the grammar editor and buttons.
*/

import { AppBar, Tab, Tabs } from "@material-ui/core";

import { GrammarTools } from "./GrammarTools";
import { TabPanel } from "../Misc/TabPanel";

import "./Panes.css";

interface IProps {
  setGrammarResponse: any; // TODO: replace for right type
}

export const LeftPane = (props: IProps) => {
  const [tabValue, setTabValue] = useState(0);

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
          value={tabValue}
          onChange={(event, newValue) => {
            setTabValue(newValue);
          }}
        >
          <Tab label="Grammar" />
          <Tab label="Define Theme" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <GrammarTools setGrammarResponse={props.setGrammarResponse} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <h1>Hi</h1>
      </TabPanel>
    </div>
  );
};
