import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const render = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

render();

if (module.hot) {
  module.hot.accept("./App", render);
}
