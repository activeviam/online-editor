import React from "react";

/*
React component containing the grammar editor and buttons.
*/

import { TabPanel } from "../Misc/TabPanel";
import { GrammarTools } from "./GrammarTools";
import {
  CustomThemeProvider,
  SequentialThemeProvider,
  ThemeMode,
} from "../TokenizeTheme";
import { TokenizeTools } from "./TokenizeTools";

import { GrammarRequestResult } from "../Types/GrammarTypes";
import { ParsedCustomLanguage } from "../Types/TokenizeTypes";

import "./Panes.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
  isGrammarCompiled: boolean | undefined;
  sequentialPaletteId: string | undefined;
  parsedCustomLanguage: ParsedCustomLanguage | undefined;
  tabValue: number;
  customThemeProvider: CustomThemeProvider;
  sequentialThemeProvider: SequentialThemeProvider | undefined;
  themeMode: ThemeMode | undefined;
  setParsedCustomLanguage: (parsed: ParsedCustomLanguage) => void;
  setGrammarResponse: (response: GrammarRequestResult) => void;
  setIsGrammarCompiled: (isIt: boolean) => void;
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
    </div>
  );
};
