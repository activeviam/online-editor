import React, { useEffect, useState } from "react";

/*
Component containing the user defined language editor and its menu.
*/

import { useLocalStorage } from "react-use";

import { parseCustomLanguage } from "../requests";
import { TokenizeMenu } from "./TokenizeMenu";
import { TokenizeEditor } from "./TokenizeEditor";
import { TokenizeThemeProvider } from "../TokenizeTheme";

import { ParsedCustomLanguage } from "../Types/TokenizeTypes";

import "./Panes.css";

interface IProps {
  themeProvider: TokenizeThemeProvider | undefined;
  setThemeProvider: (themeProvider: TokenizeThemeProvider | undefined) => void;
}

export const TokenizeTools = (props: IProps) => {
  const [customLanguage, setCustomLanguage] = useLocalStorage(
    "customLanguage",
    "hello bob"
  );
  const [parsedCustomLanguage, setParsedCustomLanguage] = useState<
    ParsedCustomLanguage | undefined
  >();

  const [shouldAutoTokenize, setShouldAutoTokenize] = useLocalStorage<boolean>(
    "shouldAutoTokenize",
    false
  );

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

  useEffect(() => {
    if (customLanguage !== undefined && shouldAutoTokenize) {
      const fetchTokenized = async () => {
        const tokenized = await parseCustomLanguage(customLanguage);
        setParsedCustomLanguage(tokenized);
      };
      fetchTokenized();
    }
  }, [customLanguage, shouldAutoTokenize]);

  return (
    <div className="whole-pane">
      <div className="custom-language-menu">
        <TokenizeMenu
          onClickParse={handleParseClick}
          shouldAutoTokenize={shouldAutoTokenize}
          setShouldAutoTokenize={setShouldAutoTokenize}
        />
      </div>
      <div className="editor">
        <TokenizeEditor
          {...props}
          onChange={handleCustomLanguageChange}
          value={customLanguage || ""}
          parsedCustomLanguage={parsedCustomLanguage}
        />
      </div>
    </div>
  );
};
