import React, { useState } from "react";

import { LeftPane } from "./Components/LeftPane";
import { RightPane } from "./Components/RightPane";
import { GrammarRequestResult } from "./Types/GrammarTypes";

import "./App.css";

const App = () => {
  const [grammarResponse, setGrammarResponse] = useState<
    GrammarRequestResult | undefined
  >();

  return (
    <div className="split-screen">
      <div className="left-pane">
        <LeftPane setGrammarResponse={setGrammarResponse}></LeftPane>
      </div>
      <div className="right-pane">
        <RightPane grammarResponse={grammarResponse}></RightPane>
      </div>
    </div>
  );
};

export default App;
