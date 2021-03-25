import { editor } from "monaco-editor";
import React, { Fragment, useEffect } from "react";

import { useLocalStorage } from "react-use";

import { buildTokenColorRulesRandom } from "../TokenizeTheme";
import { GrammarRequestResult } from "../Types/GrammarTypes";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
}

export const GrammarInfo = (props: IProps) => {
  const [parseThemeRules, setParseThemeRules] = useLocalStorage<
    editor.ITokenThemeRule[]
  >("parseThemeRules", []);

  useEffect(() => {
    if (props.grammarResponse !== undefined) {
      const rules = buildTokenColorRulesRandom(props.grammarResponse);
      setParseThemeRules(rules);
    }
  }, [props.grammarResponse, setParseThemeRules]);

  return (
    <Fragment>
      <h2>
        Grammar Status:{" "}
        {props.grammarResponse ? "Compiled ✔" : "Not yet compiled ❌"}
      </h2>
      <ul>
        {props.grammarResponse && <h3>Tokens:</h3>}
        {props.grammarResponse
          ? props.grammarResponse.tokens.map((token: string) => (
              <li>{token}</li>
            ))
          : ""}
      </ul>
    </Fragment>
  );
};
