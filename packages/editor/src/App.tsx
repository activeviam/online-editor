import React from "react";

import { LeftPanel as LeftPane } from "./Components/LeftPane";
import { RightPanel as RightPane } from "./Components/RightPane";
import "./App.css";

const App = () => {
  return (
    <div className="split-screen">
      <div className="left-pane">
        <LeftPane></LeftPane>
      </div>
      <div className="right-pane">
        <RightPane></RightPane>
      </div>
    </div>
  );
};

export default App;
