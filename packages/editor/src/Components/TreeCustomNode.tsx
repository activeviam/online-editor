import React from "react";

import { Typography } from "@material-ui/core";
import { CustomNodeElementProps } from "react-d3-tree/lib/types/common";

interface IProps {
  tokenName: string;
  tokenColor: string | undefined;
  content: string | undefined;
  nodeProps: CustomNodeElementProps;
}

export const TreeCustomNode = ({
  tokenName,
  tokenColor,
  content,
  nodeProps,
}: IProps) => {
  return (
    <g>
      <circle r={15} fill={tokenColor}></circle>
      <foreignObject width="150" height="150" x="-75" y="25">
        <div
          style={{
            borderRadius: "6px",
            border: "1px solid black",
            backgroundColor: "lightyellow",
          }}
        >
          <Typography
            className="token-name"
            style={{
              textAlign: "center",
              fontWeight: tokenColor === undefined ? "bold" : "normal",
            }}
          >{`${tokenName} `}</Typography>
          <div
            style={{
              background: tokenColor,
            }}
            className="rectangle"
          />

          {content && content !== tokenName.slice(1, -1) && (
            <Typography style={{ textAlign: "center", fontSize: "14px" }}>
              {content}
            </Typography>
          )}

          {nodeProps.nodeDatum.children && (
            <button style={{ width: "100%" }} onClick={nodeProps.toggleNode}>
              <Typography>
                {nodeProps.nodeDatum.__rd3t.collapsed ? "expand" : "collapse"}
              </Typography>
            </button>
          )}
        </div>
      </foreignObject>
    </g>
  );
};
