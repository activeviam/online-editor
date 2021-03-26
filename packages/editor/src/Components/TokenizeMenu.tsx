import React from "react";

import { Button } from "@material-ui/core";

import "./Menu.css";

interface IProps {
  onClickParse: () => void;
}

export const TokenizeMenu = (props: IProps) => {
  return (
    <div className="whole-menu">
      <div className="menu-left" />
      <div className="menu-right">
        <Button
          variant="outlined"
          color="secondary"
          onClick={props.onClickParse}
          size="small"
        >
          Tokenize
        </Button>
      </div>
    </div>
  );
};
