import React from "react";

import { Button } from "@material-ui/core";

import "./Menu.css";

interface IProps {
  onClickParse: () => void;
}

export const UserDefinedLanguageMenu = (props: IProps) => {
  return (
    <div className="whole-menu">
      <div className="menu-left" />
      <div className="menu-right">
        <Button variant="outlined" color="primary" onClick={props.onClickParse}>
          Parse User Defined Language
        </Button>
      </div>
    </div>
  );
};
