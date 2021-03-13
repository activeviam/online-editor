import React, { useState } from "react";

import { FullHeightEditor } from "./FullHeightEditor";
import { parseUserDefinedLanguage } from "../requests";
import { UserDefinedLanguageMenu } from "./UserDefinedLanguageMenu";

import "./Panes.css";

export const UserDefinedLanguageTools = () => {
  const [userDefinedLanguage, setUserDefinedLanguage] = useState("hello bob");

  const handleUserDefinedLanguageChange = (
    changedUserDefinedLanguage: string | undefined
  ) => {
    if (changedUserDefinedLanguage === undefined) {
      console.error("Undefined user defined language state.");
      return;
    }
    setUserDefinedLanguage(changedUserDefinedLanguage);
  };

  const handleParseClick = async () => {
    const parsed = await parseUserDefinedLanguage(userDefinedLanguage);
    console.log(parsed);
  };

  return (
    <div className="whole-pane">
      <div className="editor">
        <FullHeightEditor
          onChange={handleUserDefinedLanguageChange}
          value={userDefinedLanguage}
        ></FullHeightEditor>
      </div>
      <div className="user-defined-language-menu">
        <UserDefinedLanguageMenu
          onClickParse={handleParseClick}
        ></UserDefinedLanguageMenu>
      </div>
    </div>
  );
};
