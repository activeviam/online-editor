import { TokenID } from "@online-editor-2020/parser";
import CSS from "csstype";

export enum ThemeID {
  Dracula,
}

class Theme {
  constructor(public styles: Map<TokenID, CSS.Properties>) {}

  public addTokenStyle(tokenId: TokenID, style: CSS.Properties) {
    this.styles.set(tokenId, style);
  }

  public getTokenStyle(tokenId: TokenID): CSS.Properties {
    return this.styles.get(tokenId)!;
  }
}

const themeTable = new Map<ThemeID, Theme>();

export const addTheme = (themeId: ThemeID): Theme => {
  if (!themeTable.has(themeId)) {
    themeTable.set(themeId, new Theme(new Map()));
  } else {
    console.warn(
      `themeTable already has theme of ThemeID ${ThemeID[themeId]}. Skipping...`
    );
  }

  return lookupTheme(themeId);
};

export const lookupTheme = (themeId: ThemeID): Theme => {
  return themeTable.get(themeId)!;
};

const DraculaTheme = addTheme(ThemeID.Dracula);

DraculaTheme.addTokenStyle(TokenID.Const, {
  color: "#ff79c6",
});

DraculaTheme.addTokenStyle(TokenID.Equals, {
  color: "#ff79c6",
});

DraculaTheme.addTokenStyle(TokenID.Identifier, {
  color: "#50fa7b",
});

DraculaTheme.addTokenStyle(TokenID.NumberLiteral, {
  color: "#bd93f8",
});

DraculaTheme.addTokenStyle(TokenID.Whitespace, {});
