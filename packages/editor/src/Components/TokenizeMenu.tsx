import React from "react";

import {
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@material-ui/core";

import "./Menu.css";

interface IProps {
  onClickParse: () => void;
  shouldAutoTokenize: boolean | undefined;
  setShouldAutoTokenize: (shouldIt: boolean) => void;
}

export const TokenizeMenu = (props: IProps) => {
  return (
    <div className="whole-menu">
      <div className="menu-left">
        <FormGroup row>
          <FormControlLabel
            label="auto tokenize"
            control={
              <Typography>
                <Switch
                  color="secondary"
                  checked={props.shouldAutoTokenize}
                  onChange={() =>
                    props.setShouldAutoTokenize(!props.shouldAutoTokenize)
                  }
                />
              </Typography>
            }
          />
        </FormGroup>
      </div>
      <div className="menu-right">
        {!props.shouldAutoTokenize && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={props.onClickParse}
            size="small"
          >
            Tokenize
          </Button>
        )}
      </div>
    </div>
  );
};
