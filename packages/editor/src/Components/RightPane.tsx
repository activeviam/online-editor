import React, { useState } from "react";

/*
React component containing the user defined language editor and button.
*/

import { useFullScreenHandle } from "react-full-screen";
import { useLocalStorage } from "react-use";
import { Orientation, Paper, Typography } from "@material-ui/core";

import { TabPanel } from "../Misc/TabPanel";
import { GrammarInfo } from "./GrammarInfo";
import {
  CustomThemeProvider,
  SequentialThemeProvider,
  ThemeMode,
} from "../TokenizeTheme";
import { TokenizeTreeSubmenu } from "./TokenizeTreeSubmenu";
import { TokenizeTree } from "./TokenizeTree";

import { ParsedCustomLanguage } from "../Types/TokenizeTypes";
import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./Panes.css";
import "./Menu.css";

interface IProps {
  customThemeProvider: CustomThemeProvider;
  grammarResponse: GrammarRequestResult | undefined;
  isGrammarCompiled: boolean | undefined;
  parsedCustomLanguage: ParsedCustomLanguage | undefined;
  sequentialPaletteId: string | undefined;
  sequentialThemeProvider: SequentialThemeProvider | undefined;
  themeMode: ThemeMode | undefined;
  tabValue: number;
  setSequentialPaletteId: (id: string) => void;
  setThemeMode: (mode: ThemeMode | undefined) => void;
  setSequentialThemeProvider: (
    themeProvider: SequentialThemeProvider | undefined
  ) => void;
  setParsedCustomLanguage: (parsed: ParsedCustomLanguage) => void;
  setCustomThemeProvider: (themeProvider: CustomThemeProvider) => void;
}

export const RightPane = (props: IProps) => {
  const [orientation, setOrientation] = useState<Orientation>("vertical");
  const [initialDepth, setInitialDepth] = useLocalStorage<number>(
    "initialDepth",
    2
  );

  const fullScreenHandle = useFullScreenHandle();

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
        <TabPanel value={props.tabValue} index={1}>
          <div className="menu-right" style={{ width: "100%", height: "100%" }}>
            <TokenizeTreeSubmenu
              {...props}
              initialDepth={initialDepth}
              orientation={orientation}
              setOrientation={setOrientation}
              setInitialDepth={setInitialDepth}
              onClickFullScreen={fullScreenHandle.enter}
            />
          </div>
        </TabPanel>
      </div>
      <div className="status-pane">
        <TabPanel value={props.tabValue} index={0}>
          <Paper className="status-paper" elevation={2}>
            <GrammarInfo {...props} />
          </Paper>
        </TabPanel>
        <TabPanel value={props.tabValue} index={1}>
          <Paper className="status-pane" elevation={2}>
            {props.parsedCustomLanguage !== undefined && (
              <TokenizeTree
                {...props}
                key={initialDepth}
                parsedCustomLanguage={props.parsedCustomLanguage!}
                initialDepth={
                  initialDepth !== undefined && initialDepth > -1
                    ? initialDepth
                    : undefined
                }
                orientation={orientation}
                setOrientation={setOrientation}
                fullScreenHandle={fullScreenHandle}
              />
            )}
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
