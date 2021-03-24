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
      <h2>Grammar Status</h2>
      <h3>not yet implemented</h3>
      <ul>
        <li>Implement grammar status itself (compiled / not compiled)</li>
        <li>Implement custom theme definer.</li>
      </ul>
    </Fragment>
  );
};
