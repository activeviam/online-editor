import React from "react";

import { LeftPane } from "./Components/LeftPane";
import { RightPane } from "./Components/RightPane";
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
