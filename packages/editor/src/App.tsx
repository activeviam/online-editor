import React, { useState } from "react";

import { useLocalStorage } from "react-use";

import { LeftPane } from "./Components/LeftPane";
import { RightPane } from "./Components/RightPane";
import { useLocalStorageThemeProvider } from "./TokenizeTheme";

import { GrammarRequestResult } from "./Types/GrammarTypes";

import "./App.css";

const App = () => {
  const [grammarResponse, setGrammarResponse] = useLocalStorage<
    GrammarRequestResult
  >("grammarRequestResult");

  const [isGrammarCompiled, setIsGrammarCompiled] = useLocalStorage<boolean>(
    "isGrammarCompiled",
    false
  );

  const [themeProvider, setThemeProvider] = useLocalStorageThemeProvider();

  const [tabValue, setTabValue] = useState(0);

  return (
    <div className="split-screen">
      <div className="left-pane">
        <LeftPane
          grammarResponse={grammarResponse}
          setGrammarResponse={setGrammarResponse}
          isGrammarCompiled={isGrammarCompiled}
          tabValue={tabValue}
          themeProvider={themeProvider}
          setIsGrammarCompiled={setIsGrammarCompiled}
          setThemeProvider={setThemeProvider}
          setTabValue={setTabValue}
        ></LeftPane>
      </div>
      <div className="right-pane">
        <RightPane
          grammarResponse={grammarResponse}
          isGrammarCompiled={isGrammarCompiled}
          tabValue={tabValue}
        ></RightPane>
      </div>
    </div>
  );
};

export default App;
