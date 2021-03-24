import React, { useState } from "react";

/*
Component containing the user defined language editor and its menu.
*/

import { useLocalStorage } from "react-use";

import { parseCustomLanguage } from "../requests";
import { TokenizeMenu } from "./TokenizeMenu";
import { TokenizeEditor } from "./TokenizeEditor";

import { GrammarRequestResult } from "../Types/GrammarTypes";
import { ParsedCustomLanguage } from "../Types/TokenizeTypes";

import "./Panes.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
}

export const TokenizeTools = (props: IProps) => {
  const [customLanguage, setCustomLanguage] = useLocalStorage(
    "customLanguage",
    "hello bob"
  );
  const [parsedCustomLanguage, setParsedCustomLanguage] = useState<
    ParsedCustomLanguage | undefined
  >();

  const handleCustomLanguageChange = (
    changedCustomLanguage: string | undefined
  ) => {
    if (changedCustomLanguage === undefined) {
      console.error("Undefined custom language state.");
      return;
    }
    setCustomLanguage(changedCustomLanguage);
  };

  const handleParseClick = async () => {
    if (customLanguage === undefined) {
      return;
    }
    const parsed = await parseCustomLanguage(customLanguage);
    setParsedCustomLanguage(parsed);
  };

  return (
    <div className="whole-pane">
      <div className="custom-language-menu">
        <TokenizeMenu onClickParse={handleParseClick} />
      </div>
      <div className="editor">
        <TokenizeEditor
          onChange={handleCustomLanguageChange}
          value={customLanguage || ""}
          grammarResponse={props.grammarResponse}
          parsedCustomLanguage={parsedCustomLanguage}
        />
      </div>
    </div>
  );
};
