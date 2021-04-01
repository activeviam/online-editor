import React, { useState } from "react";

import { useLocalStorage } from "react-use";

import { LeftPane } from "./Components/LeftPane";
import { RightPane } from "./Components/RightPane";
import {
  getSequentialPaletteIds,
  useLocalStorageThemeProvider,
} from "./TokenizeTheme";

import { GrammarRequestResult } from "./Types/GrammarTypes";

import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import { Tab, Tabs, Typography } from "@material-ui/core";

const App = () => {
  const [grammarResponse, setGrammarResponse] = useLocalStorage<
    GrammarRequestResult
  >("grammarRequestResult");

  const [isGrammarCompiled, setIsGrammarCompiled] = useLocalStorage<boolean>(
    "isGrammarCompiled",
    false
  );

  const [themeMode, setThemeMode] = useLocalStorage("themeMode", "sequential");
  const [themeProvider, setThemeProvider] = useLocalStorageThemeProvider();
  const sequentialPaletteIds = getSequentialPaletteIds();
  const [sequentialPaletteId, setSequentialPaletteId] = useLocalStorage(
    "sequentialPaletteId",
    sequentialPaletteIds[0]
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
            ANTLR Typescript visualization toolkit
          </Typography>
        </div>
      </div>
      <div className="split-screen">
        <div className="left-pane">
          <LeftPane
            grammarResponse={grammarResponse}
            setGrammarResponse={setGrammarResponse}
            isGrammarCompiled={isGrammarCompiled}
            sequentialPaletteId={sequentialPaletteId}
            tabValue={tabValue}
            themeMode={themeMode}
            themeProvider={themeProvider}
            setIsGrammarCompiled={setIsGrammarCompiled}
            setThemeProvider={setThemeProvider}
          ></LeftPane>
        </div>
        <div className="right-pane">
          <RightPane
            grammarResponse={grammarResponse}
            isGrammarCompiled={isGrammarCompiled}
            sequentialPaletteId={sequentialPaletteId}
            tabValue={tabValue}
            themeMode={themeMode}
            themeProvider={themeProvider}
            setSequentialPaletteId={setSequentialPaletteId}
            setThemeMode={setThemeMode}
            setThemeProvider={setThemeProvider}
          ></RightPane>
        </div>
      </div>
    </div>
  );
};

export default App;
