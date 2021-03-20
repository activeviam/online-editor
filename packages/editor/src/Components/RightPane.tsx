import React, { useState } from "react";

/*
React component containing the user defined language editor and button.
*/

import { AppBar, Tab, Tabs } from "@material-ui/core";
import { TabPanel } from "../Misc/TabPanel";
import { CustomLanguageTools } from "./CustomLanguageTools";
import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./Panes.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
}

export const RightPane = (props: IProps) => {
  //const [visitor, setVisitor] = useState("Visitor Code");
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
          <Tab label="Custom Language"></Tab>
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <CustomLanguageTools grammarResponse={props.grammarResponse} />
      </TabPanel>
    </div>
  );
};
