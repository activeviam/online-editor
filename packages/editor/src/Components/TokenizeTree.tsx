import React, { useEffect, useRef, useState } from "react";

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
import { TreeCustomNode } from "./TreeCustomNode";

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
    let candidateColor: string | undefined;
    if (
      props.themeMode === ThemeMode.Sequential &&
      props.sequentialThemeProvider !== undefined
    ) {
      candidateColor = props.sequentialThemeProvider.getTokenColor(tokenName);
    } else if (props.themeMode === ThemeMode.Custom) {
      candidateColor = props.customThemeProvider.getTokenColor(tokenName);
    }
    if (candidateColor === undefined) {
      return undefined;
    }
    return "#" + candidateColor;
  };

  const renderCustomNodeElement = (nodeProps: CustomNodeElementProps) => {
    const tokenName = nodeProps.nodeDatum.name;
    const tokenColor = getTokenColor(tokenName);

    const content = // this is the token's matched text for generic tokens
      nodeProps.nodeDatum.attributes &&
      nodeProps.nodeDatum.attributes.hasOwnProperty("content")
        ? nodeProps.nodeDatum.attributes.content
        : undefined;

    return (
      <TreeCustomNode
        tokenName={tokenName}
        tokenColor={tokenColor}
        content={content}
        nodeProps={nodeProps}
      />
    );
  };

  // used to center tree on first render
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
