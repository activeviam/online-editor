import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
} from "@material-ui/core";

import FullscreenIcon from "@material-ui/icons/Fullscreen";
import React, { Fragment } from "react";
import { Orientation } from "react-d3-tree/lib/types/common";

import "./Menu.css";

interface IProps {
  tabValue: number;
  initialDepth: number | undefined;
  orientation: Orientation | undefined;
  onClickFullScreen: () => void;
  setOrientation: (newOrientation: Orientation) => void;
  setInitialDepth: (newDepth: number | undefined) => void;
}

export const TokenizeTreeSubmenu = (props: IProps) => {
  const minSelectorWidth = 220;

  return (
    <Fragment>
      <IconButton onClick={props.onClickFullScreen}>
        <FullscreenIcon />
      </IconButton>
      <div className="divider" />
      <TextField
        id="outlined-number"
        value={props.initialDepth}
        color="secondary"
        label="initial depth"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{ inputProps: { min: -1 } }}
        size="small"
        variant="outlined"
        onChange={(event) => {
          const newNumber = Number(event.target.value);
          props.setInitialDepth(newNumber);
        }}
      />
      <div className="divider" />
      <FormControl style={{ minWidth: minSelectorWidth }}>
        <InputLabel color="secondary">tree mode</InputLabel>
        <Select
          value={props.orientation}
          onChange={(event) => {
            props.setOrientation(event.target.value as Orientation);
          }}
          color="secondary"
        >
          <MenuItem value="vertical" style={{ minWidth: minSelectorWidth }}>
            vertical
          </MenuItem>
          <MenuItem value="horizontal" style={{ minWidth: minSelectorWidth }}>
            horizontal
          </MenuItem>
        </Select>
      </FormControl>
    </Fragment>
  );
};
