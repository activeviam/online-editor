import React, { useEffect, useRef, useState } from "react";

import { Typography } from "@material-ui/core";
import { FullScreen, FullScreenHandle } from "react-full-screen";

import Tree from "react-d3-tree";
import {
  CustomNodeElementProps,
  Orientation,
  Point,
} from "react-d3-tree/lib/types/common";

import {
  CustomThemeProvider,
  SequentialThemeProvider,
  ThemeMode,
} from "../TokenizeTheme";

import { ParsedCustomLanguage } from "../Types/TokenizeTypes";

import "./Menu.css";
import "./CustomizeTheme.css";

interface IProps {
  customThemeProvider: CustomThemeProvider;
  initialDepth: number | undefined;
  parsedCustomLanguage: ParsedCustomLanguage;
  fullScreenHandle: FullScreenHandle;
  sequentialThemeProvider: SequentialThemeProvider | undefined;
  themeMode: ThemeMode | undefined;
  orientation: Orientation;
  setOrientation: (newOrientation: Orientation) => void;
  setParsedCustomLanguage: (parsed: ParsedCustomLanguage) => void;
}

export const TokenizeTree = (props: IProps) => {
  const getTokenColor = (tokenName: string) => {
    if (
      props.themeMode === ThemeMode.Sequential &&
      props.sequentialThemeProvider !== undefined
    ) {
      const candidate = props.sequentialThemeProvider.getTokenColor(tokenName);
      if (candidate === undefined) {
        return undefined;
      }
      return "#" + candidate;
    } else if (props.themeMode === ThemeMode.Custom) {
      const candidate = props.customThemeProvider.getTokenColor(tokenName);
      if (candidate === undefined) {
        return undefined;
      }
      return "#" + candidate;
    }
  };

  const renderCustomNodeElement = (nodeProps: CustomNodeElementProps) => {
    const tokenName = nodeProps.nodeDatum.name;
    const tokenColor = getTokenColor(tokenName);

    const content = // this is the token's matched text for generic tokens
      nodeProps.nodeDatum.attributes &&
      nodeProps.nodeDatum.attributes.hasOwnProperty("content")
        ? nodeProps.nodeDatum.attributes.content
        : undefined;

    if (content) {
      console.log(content, tokenName.slice(1, -1));
    }

    return (
      <g>
        <circle r={15} fill={tokenColor}></circle>
        <foreignObject
          width="150"
          height="150"
          x="-75"
          y="25"
          style={{ borderRadius: "4px" }}
        >
          <div
            style={{
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
                {nodeProps.nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
              </button>
            )}
          </div>
        </foreignObject>
        <h1>{nodeProps.nodeDatum.name}</h1>
      </g>
    );
  };

  const [translatePoint, setTranslatePoint] = useState<Point | undefined>();

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current === null) {
      setTranslatePoint(undefined);
      return () => {};
    }
    const divWidth = ref.current.getBoundingClientRect().x;
    const divHeight = ref.current.getBoundingClientRect().y;

    setTranslatePoint({
      x: divWidth / 2,
      y: divHeight / 2,
    });
  }, [setTranslatePoint]);

  return (
    <div ref={ref} style={{ height: "100%", width: "100%" }}>
      <FullScreen handle={props.fullScreenHandle}>
        <Tree
          initialDepth={props.initialDepth}
          zoomable={true}
          translate={translatePoint}
          data={props.parsedCustomLanguage.orgChart}
          renderCustomNodeElement={renderCustomNodeElement}
          orientation={props.orientation}
          nodeSize={{ x: 200, y: 200 }}
        />
      </FullScreen>
    </div>
  );
};
