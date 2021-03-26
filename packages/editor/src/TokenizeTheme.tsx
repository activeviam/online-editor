import monaco from "monaco-editor";

import { GrammarRequestResult } from "./Types/GrammarTypes";

const LightOceanColors = [
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

const OneLightUI = [
  "346ADF",
  "A626A4",
  "50A14F",
  "E45649",
  "CA1243",
  "4078F2",
  "986801",
  "C18401",
];

// TODO: add theme selector.

export const buildTokenColorRulesRandom = (
  grammarResponse: GrammarRequestResult
): monaco.editor.ITokenThemeRule[] => {
  const { tokens } = grammarResponse;
  return tokens
    ? tokens.map((tokenId: string, index: number) => ({
        token: tokenId,
        foreground: OneLightUI[index % OneLightUI.length],
      }))
    : [];
};
