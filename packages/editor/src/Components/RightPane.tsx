import React, { useState } from "react";

/*
React component containing the user defined language editor and button.
*/

import { AppBar, Tab, Tabs } from "@material-ui/core";
import { TabPanel } from "../Misc/TabPanel";
import { UserDefinedLanguageTools } from "./UserDefinedLanguageTools";

import "./Panes.css";

export const RightPane = () => {
  //const [visitor, setVisitor] = useState("Visitor Code");
  const [tabValue, setTabValue] = useState(0);

  return (
    <div className="whole-pane">
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
        <UserDefinedLanguageTools />
      </TabPanel>
    </div>
  );
};
