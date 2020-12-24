import React from "react";
import { render } from "@testing-library/react";
import { TokenComponent } from "./token_renderer";
import {
  IdentifierToken,
  NumberLiteralToken,
  Token,
  TokenID,
} from "@online-editor-2020/parser";
import { lookupTheme, ThemeID } from "./token_styling";
import { type } from "os";

test("renders const pink", () => {
  const currentTheme = lookupTheme(ThemeID.Dracula);
  const token = new Token(TokenID.Const);
  const expectedStyle = currentTheme.getTokenStyle(token.tokenId);
  const expectedColor = expectedStyle.color;
  const { container } = render(<TokenComponent token={token}></TokenComponent>);
  expect(container.firstChild.firstChild).toHaveStyle(
    `color: ${expectedColor}`
  );
});

test("renders identifier green", () => {
  const currentTheme = lookupTheme(ThemeID.Dracula);
  const token = new Token(TokenID.Identifier);
  const expectedStyle = currentTheme.getTokenStyle(token.tokenId);
  const expectedColor = expectedStyle.color;
  const { container } = render(<TokenComponent token={token}></TokenComponent>);
  expect(container.firstChild.firstChild).toHaveStyle(
    `color: ${expectedColor}`
  );
});

test("renders equals pink", () => {
  const currentTheme = lookupTheme(ThemeID.Dracula);
  const token = new IdentifierToken("a", false);
  const expectedStyle = currentTheme.getTokenStyle(token.tokenId);
  const expectedColor = expectedStyle.color;
  const { container } = render(<TokenComponent token={token}></TokenComponent>);
  expect(container.firstChild.firstChild).toHaveStyle(
    `color: ${expectedColor}`
  );
});

test("renders numberLiteral purple", () => {
  const currentTheme = lookupTheme(ThemeID.Dracula);
  const token = new NumberLiteralToken(1, "1");
  const expectedStyle = currentTheme.getTokenStyle(token.tokenId);
  const expectedColor = expectedStyle.color;
  const { container } = render(<TokenComponent token={token}></TokenComponent>);
  expect(container.firstChild.firstChild).toHaveStyle(
    `color: ${expectedColor}`
  );
});

test("for every theme, every token has a style defined", () => {
  for (const themeId in Object.keys(ThemeID)) {
    if (typeof ThemeID[themeId] !== "string") {
      continue;
    }

    const themeIdString = ThemeID[Number(themeId)];
    const themeIdTyped: ThemeID =
      ThemeID[themeIdString as keyof typeof ThemeID];
    const theme = lookupTheme(themeIdTyped);

    for (const tokenId in Object.keys(TokenID)) {
      if (typeof TokenID[tokenId] !== "string") {
        continue;
      }

      const tokenIdString = TokenID[Number(tokenId)];
      const tokenIdTyped: TokenID =
        TokenID[tokenIdString as keyof typeof TokenID];
      expect(theme.styles.has(tokenIdTyped)).toBeTruthy();
    }
  }
});
