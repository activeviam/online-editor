import { useState, Dispatch, SetStateAction } from "react";

/* Defines how tokenize will attribute colors to tokens during syntax highlighting. */

import { editor } from "monaco-editor";
import { useEffectOnce, useLocalStorage } from "react-use";

import { TokenInfo } from "./Types/TokenizeTypes";

/*
  The pragmatic id is either the name of the the token if non-generic
  or the token's text between single quotes if generic.
  (generic tokens start with T__ and have been created automatically by ANTLR)
*/
export type TokenPragmaticId = string;

// color used to syntax highlight a given token
export type TokenizeColor = string;

export enum ThemeMode {
  Sequential = "sequential",
  Custom = "custom",
}

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
    const rules = [...this.colorsAssigned.keys()].map((tokenPragmaticId) => ({
      token: tokenPragmaticId,
      foreground: this.getTokenColor(tokenPragmaticId),
    }));
    return rules;
  }

  public customizeColor(
    tokenPragmaticId: TokenPragmaticId,
    color: TokenizeColor
  ) {
    console.warn(
      "Customize not implemented in TokenizeThemeProvider base class. Ignoring..."
    );
  }

  public changeColorPalette(newPaletteId: SequentialPaletteId) {}

  public serialize(): { colorsAssigned: string; colorPaletteId?: string } {
    return {
      colorsAssigned: JSON.stringify(Array.from(this.colorsAssigned)),
    };
  }

  public updateTokens(newTokens: TokenPragmaticId[]) {
    const newTokensSet = new Set(newTokens);
    this.colorsAssigned = new Map(
      [...this.colorsAssigned].filter(([tokenPragmaticId, _]) =>
        newTokensSet.has(tokenPragmaticId)
      )
    );
  }

  public deserialize(stringifiedTokenColors: string) {
    this.colorsAssigned = new Map(JSON.parse(stringifiedTokenColors));
  }

  private tokensColorsToRule(tokenColors: [TokenPragmaticId, TokenizeColor][]) {
    return tokenColors.map(([tokenPragmaticId, color]) => ({
      token: tokenPragmaticId,
      foreground: color,
    }));
  }
}

/* Sequential Theme */
export type SequentialColorPalette = TokenizeColor[];

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

const GitHubLight: SequentialColorPalette = [
  "A71D5D",
  "0086B3",
  "df5000",
  "795da3",
  "0086b3",
  "F93232",
  "183691",
  "009926",
  "990073",
  "333333",
  "63a35c",
];

export type SequentialPaletteId = string;

const SequentialColorPalettes = new Map<
  SequentialPaletteId,
  SequentialColorPalette
>([
  ["OneLightUI", OneLightUI],
  ["LightOceanColors", LightOceanColors],
  ["GitHubLight", GitHubLight],
]);

export const getSequentialColorPalette = (paletteId: SequentialPaletteId) =>
  SequentialColorPalettes.get(paletteId);

export const getSequentialPaletteIds = () =>
  Array.from(SequentialColorPalettes.keys());

export class SequentialThemeProvider extends TokenizeThemeProvider {
  colorPalette: SequentialColorPalette;
  colorPaletteId: SequentialPaletteId;

  currentColorCounter: number;

  constructor(
    tokenPragmaticIds: TokenPragmaticId[],
    colorPaletteId: SequentialPaletteId
  ) {
    super();
    this.colorPaletteId = colorPaletteId;
    this.colorPalette = [];
    this.currentColorCounter = 0;
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
    tokenPragmaticIds.forEach((tokenPragmaticId) => {
      this.colorsAssigned.set(
        tokenPragmaticId,
        this.colorPalette[this.currentColorCounter % this.colorPalette.length]
      );
      this.currentColorCounter =
        (this.currentColorCounter + 1) % this.colorPalette.length;
    });
  }

  public changeColorPalette(newPaletteId: SequentialPaletteId) {
    this.colorPaletteId = newPaletteId;
    const tokenPragmaticIds = [...this.colorsAssigned.keys()];
    this.colorsAssigned = new Map();
    this.attributeSequentialColors(tokenPragmaticIds);
  }

  public updateTokens(newTokens: TokenPragmaticId[]) {
    this.colorsAssigned = new Map();
    this.currentColorCounter = 0;
    this.attributeSequentialColors(newTokens);
  }

  public serialize(): { colorsAssigned: string; colorPaletteId: string } {
    const baseSerialize = super.serialize();
    const sequentialSerialize = { colorPaletteId: this.colorPaletteId };
    return { ...baseSerialize, ...sequentialSerialize };
  }
}

export class CustomThemeProvider extends TokenizeThemeProvider {
  /* Attribute custom colors to tokens. */
  sequentialFallback: SequentialThemeProvider;
  tokenPragmaticIds: TokenPragmaticId[];

  constructor(
    tokenPragmaticIds: TokenPragmaticId[],
    sequentialColorPaletteIdRemainingTokens: string // used as default for unset tokens
  ) {
    super();

    this.tokenPragmaticIds = tokenPragmaticIds;

    // Default behavior if no custom color set
    const sequentialTheme = new SequentialThemeProvider(
      tokenPragmaticIds,
      sequentialColorPaletteIdRemainingTokens
    );
    this.sequentialFallback = sequentialTheme;
  }

  public buildRules(): editor.ITokenThemeRule[] {
    const assignedColorsRules = super.buildRules();

    const sequentialFallbackRules = [
      ...this.sequentialFallback.colorsAssigned.entries(),
    ]
      .filter(
        ([tokenPragmaticId, _]) => !this.colorsAssigned.has(tokenPragmaticId)
      )
      .map(([tokenPragmaticId, color]) => ({
        token: tokenPragmaticId,
        foreground: color,
      }));

    return assignedColorsRules.concat(sequentialFallbackRules);
  }

  public getTokenColor(
    tokenPragmaticId: TokenPragmaticId
  ): TokenizeColor | undefined {
    return (
      this.colorsAssigned.get(tokenPragmaticId) ||
      this.sequentialFallback.getTokenColor(tokenPragmaticId)
    );
  }

  public get nonCategorizedTokens() {
    return [...this.sequentialFallback.colorsAssigned.keys()];
  }

  public updateTokens(newTokens: TokenPragmaticId[]) {
    super.updateTokens(newTokens);
    this.sequentialFallback.updateTokens(newTokens);
  }

  public changeColorPalette(newPaletteId: SequentialPaletteId) {
    // in this class, changes palette of sequential fallback only
    this.sequentialFallback.changeColorPalette(newPaletteId);
  }

  public serialize(): { colorsAssigned: string; colorPaletteId: string } {
    const baseSerialize = super.serialize();
    const sequentialSerialize = {
      colorPaletteId: this.sequentialFallback.colorPaletteId,
    };
    return { ...baseSerialize, ...sequentialSerialize };
  }

  public resetTheme() {
    this.colorsAssigned = new Map();
  }

  public customizeColor(
    tokenPragmaticId: TokenPragmaticId,
    color: TokenizeColor
  ) {
    this.colorsAssigned.set(tokenPragmaticId, color);
  }
}

/* Utilities */

// hook to automatically save serialized custom theme to local storage
// sequential theme provider doesn't need one because it can be recreated
// only with palette Id and grammar response.
export const useLocalStorageCustomTheme = (
  initialFallbackPaletteId: SequentialPaletteId
): [CustomThemeProvider, Dispatch<SetStateAction<CustomThemeProvider>>] => {
  const [fallbackPaletteId, setFallbackPaletteId] = useLocalStorage<
    string | undefined
  >("sequentialThemeId", initialFallbackPaletteId);

  const [customThemeProvider, setCustomThemeProvider] = useState<
    CustomThemeProvider
  >(new CustomThemeProvider([], fallbackPaletteId || initialFallbackPaletteId));

  const [
    colorsAssignedSerializedCustom,
    setColorsAssignedSerializedCustom,
  ] = useLocalStorage<string | undefined>(
    "colorAssignedSequentialSerialized",
    undefined
  );

  useEffectOnce(() => {
    if (colorsAssignedSerializedCustom !== undefined) {
      customThemeProvider.deserialize(colorsAssignedSerializedCustom);
    }

    const handleBeforeUnload = () => {
      const serialized = customThemeProvider.serialize();
      setColorsAssignedSerializedCustom(serialized.colorsAssigned);
      if (serialized.colorPaletteId) {
        setFallbackPaletteId(serialized.colorPaletteId);
      } else {
        console.error("Undefined custom theme color palette id.");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });

  return [customThemeProvider, setCustomThemeProvider];
};

export const getTokenPragmaticDescription = (
  token: TokenInfo
): TokenPragmaticId => {
  const hoverValue = token.type.startsWith("T__")
    ? `'${token.text}'`
    : token.type;
  return hoverValue;
};
