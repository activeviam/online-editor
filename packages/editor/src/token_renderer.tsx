import React, { Fragment } from "react";
import { Token } from "@online-editor-2020/parser";
import { ThemeID, lookupTheme } from "./token_styling";
import CSS from "csstype";

/* This component is used to render tokens by using
   the Token class. (See parser/tokens.js)
*/

var currentTheme = lookupTheme(ThemeID.Dracula);

export const changeTheme = (themeId: ThemeID) => {
  currentTheme = lookupTheme(themeId);
};

const BlockStatement = (props: { style: CSS.Properties; children: any }) => {
  const { style, children } = props;

  return (
    <Fragment>
      <span>{<span style={style}>{children}</span>}</span>
    </Fragment>
  );
};

export const TokenComponent = (props: { token: Token }) => {
  const { token } = props;
  const text = token.getText();
  const style = currentTheme.getTokenStyle(token.tokenId);

  return <BlockStatement style={style}>{text}</BlockStatement>;
};
