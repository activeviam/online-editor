import React, { MutableRefObject, useEffect, useRef } from "react";

import { CustomizeThemeSubmenu } from "./CustomizeThemeSubmenu";
import { CustomTokens } from "./CustomTokens";
import { SequentialTokens } from "./SequentialTokens";
import {
  CustomThemeProvider,
  SequentialThemeProvider,
  ThemeMode,
  TokenizeThemeProvider,
} from "../TokenizeTheme";

import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./CustomizeTheme.css";

interface IProps {
  currentThemeProvider: MutableRefObject<TokenizeThemeProvider | undefined>;
  customThemeProvider: CustomThemeProvider;
  grammarResponse: GrammarRequestResult | undefined;
  sequentialPaletteId: string | undefined;
  sequentialThemeProvider: SequentialThemeProvider | undefined;
  themeMode: ThemeMode | undefined;
  setSequentialPaletteId: (id: string) => void;
  setThemeMode: (mode: ThemeMode | undefined) => void;
  setSequentialThemeProvider: (
    themeProvider: SequentialThemeProvider | undefined
  ) => void;
  setCustomThemeProvider: (themeProvider: CustomThemeProvider) => void;
}

export const GrammarInfo = (props: IProps) => {
  // theme can be sequential or custom.

  const customThemeProviderRef = useRef<CustomThemeProvider | null>(null);

  useEffect(() => {
    if (props.customThemeProvider !== undefined) {
      customThemeProviderRef.current = props.customThemeProvider;
    }
  }, [props.customThemeProvider]);

  const {
    grammarResponse,
    setSequentialThemeProvider,
    setCustomThemeProvider,
    sequentialPaletteId,
  } = props;

  useEffect(() => {
    if (grammarResponse !== undefined) {
      const tokenPragmaticIds = grammarResponse.tokens;
      if (sequentialPaletteId !== undefined) {
        setSequentialThemeProvider(
          new SequentialThemeProvider(tokenPragmaticIds, sequentialPaletteId)
        );
        if (customThemeProviderRef.current !== null) {
          customThemeProviderRef.current.updateTokens(tokenPragmaticIds);
        } else {
          console.error("No Custom Theme Provider");
        }
      } else {
        throw Error("Sequential palette id not set.");
      }
    }
  }, [
    grammarResponse,
    sequentialPaletteId,
    setSequentialThemeProvider,
    setCustomThemeProvider,
  ]);

  const handleOnChangePalette = () => {};

  const handleOnClickReset = () => {
    props.customThemeProvider.resetTheme();
    // force rerender and give visual feedback to user
    props.setThemeMode(ThemeMode.Sequential);
  };

  return (
    <div className="grammar-info-pane">
      <CustomizeThemeSubmenu
        {...props}
        onClickReset={handleOnClickReset}
        onChangePalette={handleOnChangePalette}
      />
      <div style={{ height: "100%" }}>
        {props.themeMode === ThemeMode.Sequential && (
          <SequentialTokens {...props} />
        )}
        {props.themeMode === ThemeMode.Custom && <CustomTokens {...props} />}
      </div>
    </div>
  );
};
