import React, { useState } from "react";

import { LeftPane } from "./Components/LeftPane";
import { RightPane } from "./Components/RightPane";
import { GrammarRequestResult } from "./Types/GrammarTypes";

import "./App.css";

const App = () => {
  const [grammarResponse, setGrammarResponse] = useState<
    GrammarRequestResult | undefined
  >();
  const [tabValue, setTabValue] = useState(0);

  return (
    <div className="split-screen">
      <div className="left-pane">
        <LeftPane
          grammarResponse={grammarResponse}
          setGrammarResponse={setGrammarResponse}
          tabValue={tabValue}
          setTabValue={setTabValue}
        ></LeftPane>
      </div>
      <div className="right-pane">
        <RightPane
          grammarResponse={grammarResponse}
          tabValue={tabValue}
        ></RightPane>
      </div>
    </div>
  );
};

export default App;
