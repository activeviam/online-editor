import React, { useState } from "react";
import "./App.css";
import Editor from "@monaco-editor/react";

import { GrammarMenu } from "./Components/GrammarMenu";
import { UserDefinedLanguageMenu } from "./Components/UserDefinedLanguageMenu";

const App = () => {
  const [grammar, setGrammar] = useState("Your Grammar");
  const [userDefinedLanguage, setUserDefinedLanguage] = useState(
    "Your Language"
  );
  //const [visitor, setVisitor] = useState("Visitor Code");

  const onChangeGrammar = (changedGrammar: string | undefined) => {
    if (changedGrammar === undefined) {
      console.error("Undefined grammar state.");
      return;
    }
    setGrammar(changedGrammar);
  };

  const onChangeUserDefinedLanguage = (
    changedUserDefinedLanguage: string | undefined
  ) => {
    if (changedUserDefinedLanguage === undefined) {
      console.error("Undefined user defined language state.");
      return;
    }
    setUserDefinedLanguage(changedUserDefinedLanguage);
  };

  return (
    <div className="split-screen">
      <div className="left-pane">
        <div className="editor">
          <Editor
            height="95vh"
            value={grammar}
            onChange={onChangeGrammar}
          ></Editor>
        </div>
        <div>
          <GrammarMenu
            grammar={grammar}
            //onChangeVisitor={setVisitor}
          ></GrammarMenu>
        </div>
      </div>
      <div className="right-pane">
        <div className="editor">
          <Editor
            height="95vh"
            onChange={onChangeUserDefinedLanguage}
            value={userDefinedLanguage}
          ></Editor>
        </div>
        <div>
          <UserDefinedLanguageMenu
            userDefinedLanguage={userDefinedLanguage}
            onChangeParsed={(parsed) => {
              console.log(parsed);
            }}
          ></UserDefinedLanguageMenu>
        </div>
      </div>
    </div>
  );
};

export default App;
