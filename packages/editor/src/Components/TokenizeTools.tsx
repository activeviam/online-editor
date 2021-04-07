import React, { useEffect, useRef } from "react";

/*
Component containing the user defined language editor and its menu.
*/

import { useLocalStorage } from "react-use";

import { parseCustomLanguage } from "../requests";
import { TokenizeMenu } from "./TokenizeMenu";
import { TokenizeEditor } from "./TokenizeEditor";
import {
  CustomThemeProvider,
  SequentialThemeProvider,
  ThemeMode,
} from "../TokenizeTheme";

import { GrammarRequestResult } from "../Types/GrammarTypes";
import { ParsedCustomLanguage } from "../Types/TokenizeTypes";

import "./Panes.css";

interface IProps {
  customThemeProvider: CustomThemeProvider;
  parsedCustomLanguage: ParsedCustomLanguage | undefined;
  sequentialThemeProvider: SequentialThemeProvider | undefined;
  themeMode: ThemeMode | undefined;
  grammarResponse: GrammarRequestResult | undefined;
  setParsedCustomLanguage: (parsed: ParsedCustomLanguage) => void;
}

export const TokenizeTools = (props: IProps) => {
  const [customLanguage, setCustomLanguage] = useLocalStorage(
    "customLanguage",
    "hello bob"
  );

  const [shouldAutoTokenize, setShouldAutoTokenize] = useLocalStorage<boolean>(
    "shouldAutoTokenize",
    false
  );

  // used to avoid sending an useless request after changing tabs
  // when remounting this component.
  const tokenizeFirstRun = useRef(true);

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
    props.setParsedCustomLanguage(parsed);
  };

  const { setParsedCustomLanguage } = props;
  useEffect(() => {
    if (tokenizeFirstRun.current !== false) {
      tokenizeFirstRun.current = false;
      return () => {};
    }

    if (customLanguage !== undefined && shouldAutoTokenize) {
      const fetchTokenized = async () => {
        const tokenized = await parseCustomLanguage(customLanguage);
        setParsedCustomLanguage(tokenized);
      };
      fetchTokenized();
    }
  }, [customLanguage, shouldAutoTokenize, setParsedCustomLanguage]);

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
        />
      </div>
    </div>
  );
};
