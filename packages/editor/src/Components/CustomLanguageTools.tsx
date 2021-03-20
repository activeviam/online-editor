import React, { useState } from "react";

/*
Component containing the user defined language editor and its menu.
*/

import useLocalStorage from "react-use-localstorage";

import { parseCustomLanguage } from "../requests";
import { CustomLanguageMenu } from "./CustomLanguageMenu";
import { CustomLanguageMonacoEditor } from "./CustomLanguageMonacoEditor";

import { GrammarRequestResult } from "../Types/GrammarTypes";
import { ParsedCustomLanguage } from "../Types/CustomLanguageTypes";

import "./Panes.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
}

export const CustomLanguageTools = (props: IProps) => {
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
    const parsed = await parseCustomLanguage(customLanguage);
    setParsedCustomLanguage(parsed);
  };

  return (
    <div className="whole-pane">
      <div className="editor">
        <CustomLanguageMonacoEditor
          onChange={handleCustomLanguageChange}
          value={customLanguage}
          grammarResponse={props.grammarResponse}
          parsedCustomLanguage={parsedCustomLanguage}
        />
      </div>
      <div className="custom-language-menu">
        <CustomLanguageMenu onClickParse={handleParseClick} />
      </div>
    </div>
  );
};
