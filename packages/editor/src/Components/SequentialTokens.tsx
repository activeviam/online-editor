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
    <ul className="token-ul">
      {props.sequentialThemeProvider !== undefined &&
        [...props.sequentialThemeProvider.colorsAssigned].map(
          ([tokenPragmaticId, _], index) => (
            <div
              style={{ display: "flex", justifyContent: "center" }}
              key={index}
            >
              <div className="token-info">
                <li key={index}>
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
            </div>
          )
        )}
    </ul>
  );
};
