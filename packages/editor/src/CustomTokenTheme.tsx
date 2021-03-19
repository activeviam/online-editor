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

// TODO: add theme selector.

export const buildTokenColorRulesRandom = (
  grammarResponse: GrammarRequestResult // TODO: Change Type
): monaco.editor.ITokenThemeRule[] => {
  const { allPossibleTokens } = grammarResponse;
  return allPossibleTokens.map((tokenId: string, index: number) => ({
    token: tokenId,
    foreground: LightOceanColors[index % LightOceanColors.length],
    fontStyle: "bold",
  }));
};
