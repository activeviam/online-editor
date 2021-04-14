import React from "react";

/*
React component containing the token theme definer and the syntax tree
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

import { ParsedCustomLanguage, ParseError } from "../Types/TokenizeTypes";
import {
  GrammarRequestError,
  GrammarRequestResult,
} from "../Types/GrammarTypes";

import "./Panes.css";
import "./Menu.css";

interface IProps {
  customThemeProvider: CustomThemeProvider;
  grammarResponse: GrammarRequestResult | undefined;
  isGrammarCompiled: boolean | undefined;
  grammarError: GrammarRequestError | undefined;
  showWarning: boolean | undefined;
  showGrammarError: boolean | undefined;
  showParseError: boolean | undefined;
  parsedCustomLanguage: ParsedCustomLanguage | undefined;
  parseError: ParseError | undefined;
  sequentialPaletteId: string | undefined;
  sequentialThemeProvider: SequentialThemeProvider | undefined;
  themeMode: ThemeMode | undefined;
  tabValue: number;
  setSequentialPaletteId: (id: string) => void;
  setThemeMode: (mode: ThemeMode | undefined) => void;
  setSequentialThemeProvider: (
    themeProvider: SequentialThemeProvider | undefined
  ) => void;
  setShowWarning: (newShowWarning: boolean) => void;
  setParsedCustomLanguage: (parsed: ParsedCustomLanguage) => void;
  setCustomThemeProvider: (themeProvider: CustomThemeProvider) => void;
}

export const RightPane = (props: IProps) => {
  const [orientation, setOrientation] = useLocalStorage<Orientation>(
    "orientation",
    "vertical"
  );
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
            {props.showGrammarError === true &&
              props.grammarError !== undefined && (
                <ul>
                  {props.grammarError.errors.map((error) => (
                    <li>
                      <Typography>{error}</Typography>
                    </li>
                  ))}
                </ul>
              )}
            {props.showGrammarError === false &&
              props.grammarResponse !== undefined && <GrammarInfo {...props} />}
          </Paper>
        </TabPanel>
        <TabPanel value={props.tabValue} index={1}>
          <Paper className="status-pane" elevation={2}>
            {props.showParseError === true &&
              props.parseError !== undefined && (
                <Typography>{`${props.parseError.message} (line ${props.parseError.line}, col ${props.parseError.col})`}</Typography>
              )}
            {props.showParseError !== true &&
              props.parsedCustomLanguage !== undefined && (
                <div style={{ height: "100%", width: "100%" }}>
                  <TokenizeTree
                    {...props}
                    key={initialDepth}
                    parsedCustomLanguage={props.parsedCustomLanguage}
                    initialDepth={
                      initialDepth !== undefined && initialDepth > -1
                        ? initialDepth
                        : undefined
                    }
                    orientation={orientation || "vertical"}
                    setOrientation={setOrientation}
                    fullScreenHandle={fullScreenHandle}
                  />
                </div>
              )}
          </Paper>
        </TabPanel>
      </div>
    </div>
  );
};
