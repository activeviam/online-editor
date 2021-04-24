import React from "react";

/*
React component containing the grammar editor and buttons.
*/

import { TabPanel } from "../Misc/TabPanel";
import { GrammarTools } from "./GrammarTools";
import { TokenizeThemeProvider } from "../TokenizeTheme";
import { TokenizeTools } from "./TokenizeTools";

import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./Panes.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
  isGrammarCompiled: boolean | undefined;
  sequentialPaletteId: string | undefined;
  tabValue: number;
  themeMode: string | undefined;
  themeProvider: TokenizeThemeProvider | undefined;
  setGrammarResponse: (response: GrammarRequestResult) => void;
  setIsGrammarCompiled: (isIt: boolean) => void;
  setThemeProvider: (themeProvider: TokenizeThemeProvider | undefined) => void;
}

export const LeftPane = (props: IProps) => {
  return (
    <div className="whole-pane">
      <TabPanel value={props.tabValue} index={0}>
        <GrammarTools {...props} />
      </TabPanel>
      <TabPanel value={props.tabValue} index={1}>
        <TokenizeTools {...props} />
      </TabPanel>
      <TabPanel value={props.tabValue} index={2}>
        <h3>Not yet implemented.</h3>
      </TabPanel>
    </div>
  );
};
