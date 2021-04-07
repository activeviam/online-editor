import React, { useState } from "react";

import { Tab, Tabs, Typography, AppBar } from "@material-ui/core";
import { useLocalStorage } from "react-use";

import { LeftPane } from "./Components/LeftPane";
import { RightPane } from "./Components/RightPane";
import {
  getSequentialPaletteIds,
  SequentialThemeProvider,
  ThemeMode,
  useLocalStorageCustomTheme,
} from "./TokenizeTheme";

import { GrammarRequestResult } from "./Types/GrammarTypes";
import { ParsedCustomLanguage } from "./Types/TokenizeTypes";

import "./App.css";

const App = () => {
  const [grammarResponse, setGrammarResponse] = useLocalStorage<
    GrammarRequestResult
  >("grammarRequestResult");

  const [parsedCustomLanguage, setParsedCustomLanguage] = useLocalStorage<
    ParsedCustomLanguage | undefined
  >("parsedCustomLanguage");

  const [isGrammarCompiled, setIsGrammarCompiled] = useLocalStorage<boolean>(
    "isGrammarCompiled",
    false
  );

  const [themeMode, setThemeMode] = useLocalStorage(
    "themeMode",
    ThemeMode.Sequential
  );
  const sequentialPaletteIds = getSequentialPaletteIds();
  const [sequentialPaletteId, setSequentialPaletteId] = useLocalStorage(
    "sequentialPaletteId",
    sequentialPaletteIds[0]
  );

  const [sequentialThemeProvider, setSequentialThemeProvider] = useState<
    SequentialThemeProvider
  >();

  const [
    customThemeProvider,
    setCustomThemeProvider,
  ] = useLocalStorageCustomTheme(
    sequentialPaletteId || sequentialPaletteIds[0]
  );

  const [tabValue, setTabValue] = useState(0);

  return (
    <div className="app">
      <div className="nav-bar">
        <AppBar position="static" color="transparent" className="app-bar">
          <Tabs
            value={tabValue}
            onChange={(event, newValue) => {
              setTabValue(newValue);
            }}
          >
            <Tab label="ANTLR Grammar" />
            <Tab label="Tokenize Input" />
            <Tab label="Implement Visitor" />
          </Tabs>
        </AppBar>
        <div className="application-details">
          <div className="application-details-divider" />
          <Typography variant="h2" style={{ fontSize: 18 }}>
            about
          </Typography>
          <div className="application-details-divider" />
          <Typography variant="h2" style={{ fontSize: 18 }}>
            how to use
          </Typography>
          <div className="application-details-divider" />
          <Typography variant="h1" style={{ fontSize: 32 }}>
            ANTLR TypeScript visualization toolkit
          </Typography>
        </div>
      </div>
      <div className="split-screen">
        <div className="left-pane">
          <LeftPane
            customThemeProvider={customThemeProvider}
            grammarResponse={grammarResponse}
            setGrammarResponse={setGrammarResponse}
            isGrammarCompiled={isGrammarCompiled}
            parsedCustomLanguage={parsedCustomLanguage}
            setParsedCustomLanguage={setParsedCustomLanguage}
            sequentialThemeProvider={sequentialThemeProvider}
            sequentialPaletteId={sequentialPaletteId}
            tabValue={tabValue}
            themeMode={themeMode}
            setIsGrammarCompiled={setIsGrammarCompiled}
          ></LeftPane>
        </div>
        <div className="right-pane">
          <RightPane
            customThemeProvider={customThemeProvider}
            grammarResponse={grammarResponse}
            isGrammarCompiled={isGrammarCompiled}
            parsedCustomLanguage={parsedCustomLanguage}
            sequentialPaletteId={sequentialPaletteId}
            sequentialThemeProvider={sequentialThemeProvider}
            tabValue={tabValue}
            themeMode={themeMode}
            setSequentialPaletteId={setSequentialPaletteId}
            setParsedCustomLanguage={setParsedCustomLanguage}
            setThemeMode={setThemeMode}
            setSequentialThemeProvider={setSequentialThemeProvider}
            setCustomThemeProvider={setCustomThemeProvider}
          ></RightPane>
        </div>
      </div>
    </div>
  );
};

export default App;
