import { editor } from "monaco-editor";

// from https://github.com/mike-lischke/vscode-antlr4/blob/master/themes/complete_light.json
// ... and converted with https://github.com/Nishkalkashyap/monaco-vscode-textmate-theme-converter
export const AntlrCompleteLightTheme: editor.IStandaloneThemeData = {
  inherit: false,
  base: "vs",
  colors: {
    "editorLineNumber.foreground": "ff0000",
  },
  rules: [
    { fontStyle: "italic", token: "emphasis" },
    { fontStyle: "bold", token: "strong" },
    { foreground: "#000080", token: "header" },
    { foreground: "#0987cb", token: "comment" },
    { foreground: "#0987cb", token: "comment.line" },
    { foreground: "#0987cb", token: "comment.block" },
    { foreground: "#52a0cb", token: "comment.line.double-slash" },
    { foreground: "#52a0cb", token: "comment.line.double-dash" },
    { foreground: "#52a0cb", token: "comment.line.number-sign" },
    { foreground: "#709dce", token: "comment.line.character" },
    { foreground: "#709dce", token: "comment.block.documentation" },
    { foreground: "#e57900", token: "constant" },
    { foreground: "#e57900", token: "constant.other" },
    { foreground: "#e57900", token: "constant.numeric" },
    { foreground: "#e57900", token: "constant.character" },
    { foreground: "#cc5926", token: "constant.character.escape" },
    {
      fontStyle: "bold",
      foreground: "#c5914c",
      token: "constant.language",
    },
    { foreground: "#cc666a", token: "entity" },
    { foreground: "#cc666a", token: "entity.other" },
    { foreground: "#cc4e52", token: "entity.name" },
    { foreground: "#949475", token: "entity.name.function" },
    { foreground: "#ebd8b7", token: "entity.name.type" },
    { foreground: "#cc833b", token: "entity.name.tag" },
    { foreground: "#c2c269", token: "entity.name.section" },
    {
      fontStyle: "italic underline",
      foreground: "#cf85be",
      token: "entity.other.inherited-class",
    },
    { foreground: "#eb9195", token: "entity.other.attribute-name" },
    { background: "#e03e44", foreground: "#FFFFFF", token: "invalid" },
    {
      background: "#e03e44",
      foreground: "#e5e500",
      token: "invalid.illegal",
    },
    { background: "#e0a9ab", token: "invalid.deprecated" },
    { fontStyle: "bold", foreground: "#555555", token: "keyword" },
    {
      fontStyle: "bold",
      foreground: "#555555",
      token: "keyword.control",
    },
    {
      fontStyle: "bold",
      foreground: "#555574",
      token: "keyword.operator",
    },
    {
      fontStyle: "bold",
      foreground: "#395555",
      token: "keyword.other",
    },
    { token: "markup" },
    { token: "meta" },
    { fontStyle: "bold", foreground: "#202020", token: "storage" },
    { fontStyle: "bold", foreground: "#202020", token: "storage.type" },
    {
      fontStyle: "bold",
      foreground: "#202020",
      token: "storage.modifier",
    },
    { foreground: "#e5ac00", token: "string" },
    { foreground: "#e5ac00", token: "string.quoted" },
    { foreground: "#e5ac00", token: "string.quoted.single" },
    { foreground: "#e5ac00", token: "string.quoted.double" },
    { foreground: "#e5ac00", token: "string.quoted.triple" },
    { foreground: "#e5ac00", token: "string.quoted.other" },
    { foreground: "#e5ac00", token: "string.unquoted" },
    { foreground: "#cc9900", token: "string.interpolated" },
    { foreground: "#cc9900", token: "string.regexp" },
    { foreground: "#cc9900", token: "string.other" },
    { foreground: "#9b90c3", token: "support" },
    { foreground: "#78a6a6", token: "support.function" },
    { foreground: "#9b90c3", token: "support.class" },
    { foreground: "#b9b1d5", token: "support.type" },
    { foreground: "#9b90c3", token: "support.constant" },
    { foreground: "#9b90c3", token: "support.variable" },
    { foreground: "#9b90c3", token: "support.other" },
    { foreground: "#63bf8d", token: "variable" },
    { foreground: "#63bf8d", token: "variable.parameter" },
    { foreground: "#45aa73", token: "variable.language" },
    { foreground: "#5aaa7f", token: "variable.other" },
    { foreground: "#a6a6a6", token: "entity.other.predicate" },
    { foreground: "#7d7d7d", token: "entity.other.block" },
    { foreground: "#67675f", token: "support.other.token" },
    {
      foreground: "#CFCFC2",
      token: "meta.structure.dictionary.json string.quoted.double.json",
    },
    { foreground: "#75715E", token: "meta.diff" },
    { foreground: "#75715E", token: " meta.diff.header" },
    { foreground: "#F92672", token: "markup.deleted" },
    { foreground: "#A6E22E", token: "markup.inserted" },
    { foreground: "#E6DB74", token: "markup.changed" },
    { foreground: "#b5cea8", token: "markup.inserted" },
    { foreground: "#ce9178", token: "markup.deleted" },
    { foreground: "#569cd6", token: "markup.changed" },
    { foreground: "#608b4e", token: "markup.punctuation.quote" },
    { foreground: "#d4d4d4", token: "constant.rgb-value" },
    { foreground: "#d7ba7d", token: "entity.name.selector" },
    { foreground: "#d7ba7d", token: "entity.other.attribute-name.css" },
    { fontStyle: "underline", token: "markup.underline" },
    { fontStyle: "bold", foreground: "#569cd6", token: "markup.bold" },
    {
      fontStyle: "bold",
      foreground: "#569cd6",
      token: "markup.heading",
    },
    {
      fontStyle: "italic",
      foreground: "#569cd6",
      token: "markup.italic",
    },
  ],
};
