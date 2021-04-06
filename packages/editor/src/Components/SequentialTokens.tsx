import { Typography } from "@material-ui/core";
import React from "react";
import { SequentialThemeProvider } from "../TokenizeTheme";

import "./Menu.css";
import "./CustomizeTheme.css";

interface IProps {
  sequentialThemeProvider: SequentialThemeProvider | undefined;
}

export const SequentialTokens = (props: IProps) => {
  return (
    <ul>
      {props.sequentialThemeProvider !== undefined &&
        [...props.sequentialThemeProvider.colorsAssigned].map(
          ([tokenPragmaticId, _], index) => (
            <div className="token-info" key={index}>
              <li>
                <Typography className="token-name">{`${tokenPragmaticId} `}</Typography>
                <div
                  style={{
                    background:
                      "#" +
                      props.sequentialThemeProvider!.getTokenColor(
                        tokenPragmaticId
                      ),
                  }}
                  className="rectangle"
                />
              </li>
            </div>
          )
        )}
    </ul>
  );
};
