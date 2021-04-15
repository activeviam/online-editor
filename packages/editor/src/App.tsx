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

import {
  GrammarRequestError,
  GrammarRequestResult,
} from "./Types/GrammarTypes";
import { ParsedCustomLanguage, ParseError } from "./Types/TokenizeTypes";

import "./App.css";
import { HowToUseModal } from "./Components/HowToUseModal";
import { AboutUsModal } from "./Components/AboutUsModal";

const App = () => {
  const [grammarResponse, setGrammarResponse] = useLocalStorage<
    GrammarRequestResult
  >("grammarRequestResult");

  const [parsedCustomLanguage, setParsedCustomLanguage] = useLocalStorage<
    ParsedCustomLanguage | undefined
  >("parsedCustomLanguage");

  const [parseError, setParseError] = useLocalStorage<ParseError[] | undefined>(
    "parseError",
    undefined
  );

  const [showParseError, setShowParseError] = useLocalStorage<boolean>(
    "showParseError",
    false
  );

  const [isGrammarCompiled, setIsGrammarCompiled] = useLocalStorage<boolean>(
    "isGrammarCompiled",
    false
  );

  const [grammarError, setGrammarError] = useLocalStorage<GrammarRequestError>(
    "grammarError",
    undefined
  );

  const [showGrammarError, setShowGrammarError] = useLocalStorage<boolean>(
    "showGrammarError",
    false
  );

  const [showWarning, setShowWarning] = useState(false);

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

  const [showHowToUse, setShowHowToUse] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);

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
          </Tabs>
        </AppBar>
        <div className="application-details">
          <div className="application-details-divider" />
          <AboutUsModal
            isOpen={showAboutUs}
            setShowAboutUs={setShowAboutUs}
            onAfterClose={() => setShowAboutUs(false)}
          />
          <Typography
            variant="h2"
            style={{ fontSize: 18, cursor: "pointer" }}
            onClick={() => setShowAboutUs(true)}
          >
            about us
          </Typography>
          <div className="application-details-divider" />
          <HowToUseModal
            isOpen={showHowToUse}
            setShowHowToUse={setShowHowToUse}
            onAfterClose={() => setShowHowToUse(false)}
          />
          <Typography
            variant="h2"
            style={{ fontSize: 18, cursor: "pointer" }}
            onClick={() => setShowHowToUse(true)}
          >
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
            grammarError={grammarError}
            setGrammarResponse={setGrammarResponse}
            setGrammarError={setGrammarError}
            isGrammarCompiled={isGrammarCompiled}
            parsedCustomLanguage={parsedCustomLanguage}
            setParsedCustomLanguage={setParsedCustomLanguage}
            setParseError={setParseError}
            setShowWarning={setShowWarning}
            setShowGrammarError={setShowGrammarError}
            setShowParseError={setShowParseError}
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
            grammarError={grammarError}
            isGrammarCompiled={isGrammarCompiled}
            parsedCustomLanguage={parsedCustomLanguage}
            parseError={parseError}
            showWarning={showWarning}
            sequentialPaletteId={sequentialPaletteId}
            sequentialThemeProvider={sequentialThemeProvider}
            tabValue={tabValue}
            themeMode={themeMode}
            setSequentialPaletteId={setSequentialPaletteId}
            setParsedCustomLanguage={setParsedCustomLanguage}
            setShowWarning={setShowWarning}
            showParseError={showParseError}
            showGrammarError={showGrammarError}
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
