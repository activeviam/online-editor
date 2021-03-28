import React from "react";

/*
React component containing the user defined language editor and button.
*/

import { Paper } from "@material-ui/core";

import { GrammarInfo } from "./GrammarInfo";
import { TabPanel } from "../Misc/TabPanel";

import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./Panes.css";
import "./Menu.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
  isGrammarCompiled: Boolean | undefined;
  tabValue: number;
}

export const RightPane = (props: IProps) => {
  return (
    <div className="whole-pane">
      <div
        style={{
          padding: "1.5%",
          borderRadius: "8px",
        }}
      >
        <div className="application-details">
          <h3>About</h3>
          <div className="application-details-divider" />
          <h3>How to Use</h3>
          <div className="application-details-divider" />
          <h2>ANTLR Typescript Visualization Toolkit</h2>
        </div>
      </div>
      <div className="grammar-status">
        <div className="menu-left">
          <h3>
            grammar status:
            <span
              style={
                props.isGrammarCompiled ? { color: "green" } : { color: "red" }
              }
            >
              {props.isGrammarCompiled ? " compiled ✔" : " not compiled ❌"}
            </span>
          </h3>
        </div>
      </div>
      <Paper className="status-pane" elevation={3}>
        <TabPanel value={props.tabValue} index={0}>
          <GrammarInfo grammarResponse={props.grammarResponse} />
          <h2>Theme Customizer</h2>
        </TabPanel>
        <TabPanel value={props.tabValue} index={1}>
          <h2>Parse Language Status</h2>
          <h3>not yet implemented</h3>
          <ul>
            <li>
              Implement parse language status itself (parsed / not parsed)
            </li>
            <li>Show parse tree.</li>
          </ul>
        </TabPanel>
        <TabPanel value={props.tabValue} index={2}>
          <h2>Visitor Status</h2>
          <h3>not yet implemented</h3>
          <ul>
            <li>Implement visitor code execution and output</li>
          </ul>
        </TabPanel>
      </Paper>
    </div>
  );
};
