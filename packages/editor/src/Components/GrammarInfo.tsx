import React, { useEffect, useRef } from "react";

import { useLocalStorage } from "react-use";
import ReactModal from "react-modal";
import WarningIcon from "@material-ui/icons/Warning";
import { Button, Typography } from "@material-ui/core";

import { CustomizeThemeSubmenu } from "./CustomizeThemeSubmenu";
import { CustomTokens } from "./CustomTokens";
import { SequentialTokens } from "./SequentialTokens";
import {
  CustomThemeProvider,
  SequentialThemeProvider,
  ThemeMode,
} from "../TokenizeTheme";

import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./CustomizeTheme.css";
import "./Menu.css";

interface IProps {
  customThemeProvider: CustomThemeProvider;
  grammarResponse: GrammarRequestResult | undefined;
  showWarning: boolean | undefined;
  sequentialPaletteId: string | undefined;
  sequentialThemeProvider: SequentialThemeProvider | undefined;
  themeMode: ThemeMode | undefined;
  setSequentialPaletteId: (id: string) => void;
  setThemeMode: (mode: ThemeMode | undefined) => void;
  setShowWarning: (newShowWarning: boolean) => void;
  setSequentialThemeProvider: (
    themeProvider: SequentialThemeProvider | undefined
  ) => void;
  setCustomThemeProvider: (themeProvider: CustomThemeProvider) => void;
}

export const GrammarInfo = (props: IProps) => {
  // theme can be sequential or custom.

  const customThemeProviderRef = useRef<CustomThemeProvider | null>(null);

  const [balanceColors, setBalanceColors] = useLocalStorage(
    "balanceColors",
    false
  );

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
          new SequentialThemeProvider(
            tokenPragmaticIds,
            sequentialPaletteId,
            balanceColors
          )
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
    balanceColors,
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

  const handleChangeBalanceColors = () => {
    setBalanceColors(!balanceColors);
  };

  return (
    <div className="grammar-info-pane">
      {props.grammarResponse!.warnings && (
        <ReactModal
          isOpen={props.showWarning || false}
          onAfterClose={() => props.setShowWarning(false)}
          ariaHideApp={false}
          style={{
            content: { background: "lightyellow" },
            overlay: { zIndex: 3000 },
          }}
        >
          <div style={{ height: "10%" }}>
            <div className="whole-menu">
              <div className="menu-left">
                <Typography
                  variant="h5"
                  style={{ fontWeight: "bold", textDecoration: "underline" }}
                >
                  Warning
                  {props.grammarResponse !== undefined &&
                  props.grammarResponse.warnings.length > 1
                    ? "s "
                    : " "}
                  Received <WarningIcon />
                </Typography>
              </div>
              <div className="menu-right">
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() => {
                    props.setShowWarning(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
          <ul>
            {props.grammarResponse!.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </ReactModal>
      )}
      <CustomizeThemeSubmenu
        {...props}
        balanceColors={balanceColors}
        onClickReset={handleOnClickReset}
        onChangePalette={handleOnChangePalette}
        onChangeBalanceColors={handleChangeBalanceColors}
      />
      <div className="customize-theme-pane">
        {props.themeMode === ThemeMode.Sequential && (
          <SequentialTokens {...props} />
        )}
        {props.themeMode === ThemeMode.Custom && <CustomTokens {...props} />}
      </div>
    </div>
  );
};
