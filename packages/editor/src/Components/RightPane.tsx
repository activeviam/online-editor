import React from "react";

/*
React component containing the user defined language editor and button.
*/

import { Paper, Typography } from "@material-ui/core";

import { TabPanel } from "../Misc/TabPanel";
import { GrammarInfo } from "./GrammarInfo";
import { TokenizeThemeProvider } from "../TokenizeTheme";

import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./Panes.css";
import "./Menu.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
  isGrammarCompiled: boolean | undefined;
  sequentialPaletteId: string | undefined;
  themeMode: string | undefined;
  tabValue: number;
  themeProvider: TokenizeThemeProvider | undefined;
  setSequentialPaletteId: (id: string) => void;
  setThemeMode: (mode: string) => void;
  setThemeProvider: (themeProvider: TokenizeThemeProvider | undefined) => void;
}

export const RightPane = (props: IProps) => {
  return (
    <div className="whole-pane">
      <div className="grammar-status">
        <div className="menu-left">
          <Typography style={{ fontSize: 20 }}>
            grammar status:
            <span
              style={
                props.isGrammarCompiled ? { color: "green" } : { color: "red" }
              }
            >
              {props.isGrammarCompiled ? " compiled ✔" : " not compiled ❌"}
            </span>
          </Typography>
        </div>
      </div>
      <div className="status-pane">
        <TabPanel value={props.tabValue} index={0}>
          <Paper className="status-paper" elevation={2}>
            <div className="theme-customizer" style={{ height: "90%" }}>
              <GrammarInfo {...props} />
            </div>
          </Paper>
        </TabPanel>
        <TabPanel value={props.tabValue} index={1}>
          <Paper className="status-pane" elevation={2}>
            <h2>Parse Language Status</h2>
            <h3>not yet implemented</h3>
            <ul>
              <li>
                Implement parse language status itself (parsed / not parsed)
              </li>
              <li>Show parse tree.</li>
            </ul>
          </Paper>
        </TabPanel>
        <TabPanel value={props.tabValue} index={2}>
          <h2>Visitor Status</h2>
          <h3>not yet implemented</h3>
          <ul>
            <li>Implement visitor code execution and output</li>
          </ul>
        </TabPanel>
      </div>
    </div>
  );
};
