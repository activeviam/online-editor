import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { loadWASM } from "onigasm";

const loadWebAssembly = async () => {
  await loadWASM(require("onigasm/lib/onigasm.wasm"));
};

const render = async () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

const liftOff = async () => {
  await loadWebAssembly();
  render();
};

liftOff();

if (module.hot) {
  module.hot.accept("./App", render);
}
