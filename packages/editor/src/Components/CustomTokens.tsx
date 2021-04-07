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
    <div style={{ height: "100%", width: "100%" }}>
      <ul
        style={{
          padding: "12px",
          height: "100%",
          width: "50%",
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          placeItems: "center",
        }}
      >
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
      <div className="token-categories"></div>
    </div>
  );
};
