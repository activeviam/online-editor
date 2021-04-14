import React from "react";

import { CustomTokenWithColorPicker } from "./CustomTokenWithColorPicker";
import { CustomThemeProvider } from "../TokenizeTheme";

import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./Menu.css";
import "./CustomizeTheme.css";

interface IProps {
  customThemeProvider: CustomThemeProvider;
  grammarResponse: GrammarRequestResult | undefined;
  setCustomThemeProvider: (themeProvider: CustomThemeProvider) => void;
}

export const CustomTokens = (props: IProps) => {
  return (
    <div style={{ height: "100%", width: "100%", paddingBottom: "25px" }}>
      <ul className="token-ul">
        {props.customThemeProvider.nonCategorizedTokens.map(
          (tokenName: string, index: number) => (
            <CustomTokenWithColorPicker
              {...props}
              tokenName={tokenName}
              key={index}
              id={index}
            />
          )
        )}
      </ul>
    </div>
  );
};
