import React from "react";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";

import {
  getSequentialPaletteIds,
  TokenizeThemeProvider,
} from "../TokenizeTheme";

import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./Menu.css";

import "./CustomizeTheme.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
  sequentialPaletteId: string | undefined;
  themeMode: string | undefined;
  themeProvider: TokenizeThemeProvider | undefined;
  setSequentialPaletteId: (id: string) => void;
  setThemeMode: (mode: string) => void;
  setThemeProvider: (themeProvider: TokenizeThemeProvider | undefined) => void;
}

export const GrammarInfo = (props: IProps) => {
  // theme can be sequential or custom.
  const sequentialPaletteIds = getSequentialPaletteIds();
  const minSelectorWidth = 220;

  return (
    <div className="grammar-info-pane">
      <div className="customize-theme-submenu">
        <div className="menu-left">
          <FormControl style={{ minWidth: minSelectorWidth }}>
            <InputLabel color="secondary">theme mode</InputLabel>
            <Select
              value={props.themeMode}
              onChange={(event) => {
                props.setThemeMode(event.target.value as string);
              }}
              color="secondary"
            >
              <MenuItem
                value="sequential"
                style={{ minWidth: minSelectorWidth }}
              >
                sequential
              </MenuItem>
              <MenuItem value="custom" style={{ minWidth: minSelectorWidth }}>
                custom
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="menu-right">
          {props.themeMode === "sequential" && (
            <FormControl style={{ minWidth: minSelectorWidth }}>
              <InputLabel color="secondary">
                sequential color palette
              </InputLabel>
              <Select
                value={props.sequentialPaletteId}
                onChange={(event) => {
                  props.setSequentialPaletteId(event.target.value as string);
                }}
                color="secondary"
              >
                {sequentialPaletteIds.map((paletteId, index) => (
                  <MenuItem
                    value={paletteId}
                    style={{ minWidth: minSelectorWidth }}
                    key={index}
                  >
                    {paletteId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
      </div>
      <div style={{ height: "100%" }}>
        <ul>
          {props.grammarResponse
            ? props.grammarResponse.tokens.map(
                (token: string, index: number) => (
                  <div className="token-info" key={index}>
                    <li>
                      <Typography className="token-name">{`${token} `}</Typography>
                      <div
                        style={{
                          background:
                            "#" + props.themeProvider?.getTokenColor(token),
                        }}
                        className="rectangle"
                      />
                    </li>
                  </div>
                )
              )
            : ""}
        </ul>
      </div>
    </div>
  );
};
