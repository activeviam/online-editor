import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
};

render();

if (module.hot) {
  module.hot.accept("./App", render);
}
