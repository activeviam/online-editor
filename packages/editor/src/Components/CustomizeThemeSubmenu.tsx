import React, { Fragment } from "react";

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import {
  CustomThemeProvider,
  getSequentialPaletteIds,
  SequentialThemeProvider,
  ThemeMode,
} from "../TokenizeTheme";

import "./Menu.css";
import "./CustomizeTheme.css";

interface IProps {
  customThemeProvider: CustomThemeProvider;
  balanceColors: boolean | undefined;
  sequentialThemeProvider: SequentialThemeProvider | undefined;
  sequentialPaletteId: string | undefined;
  themeMode: ThemeMode | undefined;
  onChangePalette: () => void;
  onClickReset: () => void;
  onChangeBalanceColors: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setSequentialPaletteId: (id: string) => void;
}

export const CustomizeThemeSubmenu = (props: IProps) => {
  const minSelectorWidth = 220;
  const sequentialPaletteIds = getSequentialPaletteIds();

  return (
    <div className="customize-theme-submenu">
      <div className="menu-left">
        <FormControl style={{ minWidth: minSelectorWidth }}>
          <InputLabel color="secondary">theme mode</InputLabel>
          <Select
            value={props.themeMode}
            onChange={(event) => {
              props.setThemeMode(event.target.value as ThemeMode);
            }}
            color="secondary"
          >
            <MenuItem value="sequential" style={{ minWidth: minSelectorWidth }}>
              sequential
            </MenuItem>
            <MenuItem value="custom" style={{ minWidth: minSelectorWidth }}>
              custom
            </MenuItem>
          </Select>
        </FormControl>
        {props.themeMode === ThemeMode.Custom && (
          <Fragment>
            <div className="divider" />
            <Button
              onClick={props.onClickReset}
              variant="text"
              color="secondary"
              size="small"
            >
              reset
            </Button>
          </Fragment>
        )}
      </div>
      <div className="menu-right">
        {props.themeMode === ThemeMode.Sequential && (
          <Fragment>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.balanceColors}
                  onChange={props.onChangeBalanceColors}
                />
              }
              label="Balanced Symbols"
            />
            <div className="divider" />
            <FormControl style={{ minWidth: minSelectorWidth }}>
              <InputLabel color="secondary">
                sequential color palette
              </InputLabel>
              <Select
                value={props.sequentialPaletteId}
                onChange={(event) => {
                  props.setSequentialPaletteId(event.target.value as string);
                  props.onChangePalette();
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
          </Fragment>
        )}
      </div>
    </div>
  );
};
