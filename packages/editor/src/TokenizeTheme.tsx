import React, { useEffect, useState } from "react";

/* Defines how tokenize will attribute colors to tokens during syntax highlighting. */

import { editor } from "monaco-editor";
import { useLocalStorage } from "react-use";

import { TokenInfo } from "./Types/TokenizeTypes";

/*
  The pragmatic id is either the name of the the token if non-generic
  or the token's text between single quotes if generic.
  (generic tokens start with T__ and have been created automatically by ANTLR)
*/
type TokenPragmaticId = string;

// color used to syntax highlight a given token
type TokenizeColor = string;

/* The Tokenize Theme Provider is used to attribute colors for the syntax highlighting.
   Currently, there are two implementations of TokenizeTheme:
     * SequentialTheme: use a color palette array to attribute tokens to colors
       sequentially.
     * CustomTheme: Dinamically change token colors.
       Can inherit from old Custom Theme and/or use a sequential theme as
       default when no color provided for a particular token.
*/
export abstract class TokenizeThemeProvider {
  colorsAssigned: Map<TokenPragmaticId, TokenizeColor>;

  constructor() {
    this.colorsAssigned = new Map();
  }

  public getTokenColor(
    tokenPragmaticId: TokenPragmaticId
  ): TokenizeColor | undefined {
    const color = this.colorsAssigned.get(tokenPragmaticId);
    return color;
  }

  public buildRules(): editor.ITokenThemeRule[] {
    const rules = [...this.colorsAssigned.entries()].map(
      ([tokenPragmaticId, color]) => ({
        token: tokenPragmaticId,
        foreground: color,
      })
    );
    return rules;
  }

  public serialize(): { colorsAssigned: string; colorPaletteId?: string } {
    return {
      colorsAssigned: JSON.stringify(Array.from(this.colorsAssigned)),
    };
  }
}

/* Sequential Theme */
type SequentialColorPalette = TokenizeColor[];

const LightOceanColors: SequentialColorPalette = [
  "a4bf8d",
  "ebca89",
  "be6069",
  "b48ead",
  "4e5a65",
  "8fa1b3",
  "e1ae7f",
  "8a92a3",
  "636b7e",
  "d18771",
];

const OneLightUI: SequentialColorPalette = [
  "346ADF",
  "A626A4",
  "50A14F",
  "E45649",
  "CA1243",
  "4078F2",
  "986801",
  "C18401",
];

type SequentialPaletteId = string;

const SequentialColorPalettes = new Map<
  SequentialPaletteId,
  SequentialColorPalette
>([
  ["LightOceanColors", LightOceanColors],
  ["OneLightUI", OneLightUI],
]);

export const getSequentialColorPalette = (paletteId: SequentialPaletteId) =>
  SequentialColorPalettes.get(paletteId);

export class SequentialThemeProvider extends TokenizeThemeProvider {
  colorPalette: SequentialColorPalette;
  colorPaletteId: SequentialPaletteId;

  constructor(
    tokenPragmaticIds: TokenPragmaticId[],
    colorPaletteId: SequentialPaletteId
  ) {
    super();
    this.colorPaletteId = colorPaletteId;
    this.colorPalette = [];
    const colorPalette = getSequentialColorPalette(colorPaletteId);
    if (colorPalette !== undefined) {
      this.colorPalette = colorPalette;
      this.attributeSequentialColors(tokenPragmaticIds);
    } else {
      console.warn(
        `Couldn't find color palette of id ${colorPaletteId}. Leaving empty...`
      );
    }
  }

  private attributeSequentialColors(tokenPragmaticIds: TokenPragmaticId[]) {
    tokenPragmaticIds.forEach((tokenPragmaticId, index) => {
      this.colorsAssigned.set(
        tokenPragmaticId,
        this.colorPalette[index % this.colorPalette.length]
      );
    });
  }

  public serialize(): { colorsAssigned: string; colorPaletteId: string } {
    const baseSerialize = super.serialize();
    const sequentialSerialize = { colorPaletteId: this.colorPaletteId };
    return { ...baseSerialize, ...sequentialSerialize };
  }
}

const INTERNAL_DEFAULT_COLOR = "000000";

export class CustomThemeProvider extends TokenizeThemeProvider {
  /* Attribute custom colors to tokens. */

  constructor(
    tokenPragmaticIds: TokenPragmaticId[],
    previousTheme?: CustomThemeProvider, // if provided inherits colors from previous theme
    sequentialColorPaletteIdRemainingTokens?: string,
    // ...if provided, used as default for not set tokens
    defaultColor?: TokenizeColor
    // ...used as a last resource only if sequential palette not provided
  ) {
    super();
    if (previousTheme) {
      this.colorsAssigned = previousTheme.colorsAssigned;
      // token garbage collector. delete old tokens if not in current tokens.
      // we can't keep everything forever.
      const garbage = new Set(this.colorsAssigned.keys());

      for (const notGarbage of tokenPragmaticIds) {
        garbage.delete(notGarbage);
      }

      for (const trashToken of garbage) {
        this.colorsAssigned.delete(trashToken);
      }
    }

    // Default behavior if no custom color set
    const nonAttributedTokens = tokenPragmaticIds.filter(
      (tokenPragmaticId) => !(tokenPragmaticId in this.colorsAssigned)
    );
    if (sequentialColorPaletteIdRemainingTokens) {
      const sequentialTheme = new SequentialThemeProvider(
        nonAttributedTokens,
        sequentialColorPaletteIdRemainingTokens
      );
      this.colorsAssigned = { ...this.colorsAssigned, ...sequentialTheme };
    } else {
      nonAttributedTokens.forEach((tokenPragmaticId) => {
        this.colorsAssigned.set(
          tokenPragmaticId,
          defaultColor || INTERNAL_DEFAULT_COLOR
        );
      });
    }
  }

  public customizeColor(
    tokenPragmaticId: TokenPragmaticId,
    color: TokenizeColor
  ) {
    this.colorsAssigned.set(tokenPragmaticId, color);
  }
}

/* Utilities */

// hook to automatically save serialized theme to local storage
export const useLocalStorageThemeProvider = (
  initialValue: TokenizeThemeProvider | undefined = undefined
): [
  TokenizeThemeProvider | undefined,
  React.Dispatch<React.SetStateAction<TokenizeThemeProvider | undefined>>
] => {
  const [
    colorsAssignedSerialized,
    setColorsAssignedSerialized,
  ] = useLocalStorage<string | undefined>("colorAssignedSerialized", undefined);

  /* Used to recover from sequential */
  const [sequentialPaletteId, setSequentialPaletteId] = useLocalStorage<
    string | undefined
  >("sequentialThemeId", undefined);

  const [themeProvider, setThemeProvider] = useState<
    TokenizeThemeProvider | undefined
  >(initialValue);

  useEffect(() => {
    if (themeProvider === undefined && colorsAssignedSerialized !== undefined) {
      console.log("set provider");
      const colorsAssigned = new Map<TokenPragmaticId, TokenizeColor>(
        JSON.parse(colorsAssignedSerialized)
      );
      if (sequentialPaletteId !== undefined) {
        if (getSequentialColorPalette(sequentialPaletteId) === undefined) {
          setSequentialPaletteId(undefined);
          console.warn("Invalid sequential theme id. Unsetting...");
          return () => {};
        }
        const newThemeProvider = new SequentialThemeProvider(
          [],
          sequentialPaletteId
        );
        newThemeProvider.colorsAssigned = colorsAssigned;
        setThemeProvider(newThemeProvider);
      } else {
        const newThemeProvider = new CustomThemeProvider([]);
        newThemeProvider.colorsAssigned = colorsAssigned;
        setThemeProvider(newThemeProvider);
      }
    }
  }, [
    themeProvider,
    colorsAssignedSerialized,
    sequentialPaletteId,
    setSequentialPaletteId,
  ]);

  useEffect(() => {
    return () => {
      if (themeProvider !== undefined) {
        const serialized = themeProvider.serialize();
        setColorsAssignedSerialized(serialized.colorsAssigned);
        if (serialized.colorPaletteId) {
          setSequentialPaletteId(serialized.colorPaletteId);
        } else {
          setSequentialPaletteId(undefined);
        }
      }
    };
  }, [themeProvider, setSequentialPaletteId, setColorsAssignedSerialized]);

  return [themeProvider, setThemeProvider];
};

export const getTokenPragmaticDescription = (
  token: TokenInfo
): TokenPragmaticId => {
  const hoverValue = token.type.startsWith("T__")
    ? `'${token.text}'`
    : token.type;
  return hoverValue;
};
