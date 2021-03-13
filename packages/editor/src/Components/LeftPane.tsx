import React, { useState } from "react";

/*
React component containing the grammar editor and buttons.
*/

import { AppBar, Tab, Tabs } from "@material-ui/core";
import { GramarTools } from "./GramarTools";
import { TabPanel } from "../Misc/TabPanel";

import "./Panes.css";

export const LeftPane = () => {
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
          <Tab label="Grammar" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <GramarTools />
      </TabPanel>
    </div>
  );
};
