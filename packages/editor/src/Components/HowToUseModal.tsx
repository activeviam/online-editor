import { Button, Typography } from "@material-ui/core";
import React from "react";

import ReactModal from "react-modal";
import ReactMarkDown from "react-markdown";

const markdownContent = `
## What is this?

**ANTLR TypeScript Visualization Toolkit** (or antlr.tv) is a web
application that aims to be an intuitive, easy to use front end to the
ANTLR parse generator. You can develop a grammar, specify a theme,
compose the text to be parsed and dynamically interact with its parsed
tree. All the features are available on the fly without having to deal
with the ANTLR java executable. The objective of this application is
to attract new users that don’t yet have much familiarity with ANTLR,
but these tools can still be useful to more advanced users. Being a
web application, it allows for versatile deployment strategies, e.g.,
a local integrated application (similar to Jupyter Notebook, an
emblematic example of a web application whose adoption turned massive
for Python development, especially in Data Science), a Docker image,
an Electron desktop application, or even just being hosted online on a
live website with a cool address.

---

## List of Features

## Grammar Editor

A monaco editor that allows the user to define their ANTLR grammar to
define their DSL. This editor features textmate based syntax
highlighting with the [Complete Light][] theme. Grammars can also be
uploaded from files.

## Theme Selection

After compiling the grammar, users can attribute colors to tokens to
customize how the tokenization features will look. There are two theme
modes:

-   **Sequential Theme**: colors will be attributed to tokens in order
    of appearance by using a certain color palette. Users can change the
    color palette to be used. Currently there are four color palettes in
    the project (OneLightUI, Complete Light, Light Ocean Colors, GitHub
    Light). Optionally can match open and close symbols (for example
    match parenthesis’ colors).

-   **Custom Theme**: inherits all colors initially from a sequential
    theme. Then users can individually attribute colors to tokens by
    using a color picker. Can be reset at any time.

## Tokenize Editor

This editor accepts the user defined DSL. Its contents are also used for
the next feature, the parse tree.

-   **Syntax Highlighting**: each token is highlighted with the color
    attributed by the selected theme.

-   **Hover**: when mouse hovers a word, shows the name of the token.

-   **Autocomplete**: for generic tokens, i.e., tokens that have been
    implicitly defined, e.g., ’program’.

-   **Autotokenize**: users can activate autotokenize to parse the
    editor’s contents automatically when they change.

## Interactive Parse Tree

The parsed tree for the input in the Tokenize Editor. It is interactive
in the sense that it can be moved around with the mouse and rules can be
expanded or collapsed.

-   **Initial Depth**: the parse tree can grow really fast. The user can
    change what the initial depth of the tree should be (defaults to 2).

-   **Orientation**: users can choose between a vertical or a horizontal
    tree (defaults to vertical).

-   **Full-screen**: the tree can also be viewed in full-screen (helpful for bigger trees).

## Error Handling

Some of the requests in our program might fail for a variety
of reasons. We have error handling to manage these situations in both
the frontend and the backend.

After grammar compilation, grammar warnings are shown as a popup that
the user can close. Grammar errors, on the other hand, replace the theme
definer (we don’t have any tokens anyway when grammar compilation
fails).

In a similar fashion, tokenize errors can replace the interactive parse
tree when they exist. This replacement has shown itself performant
enough to not be a problem even when changing the text with auto
tokenize turned on.

  [Complete Light]: https://github.com/mike-lischke/vscode-antlr4/blob/master/themes/complete_light.json
`;

interface IProps {
  isOpen: boolean;
  onAfterClose: () => void;
  setShowHowToUse: (shouldIt: boolean) => void;
}

export const HowToUseModal = (props: IProps) => {
  return (
    <ReactModal
      isOpen={props.isOpen}
      onAfterClose={props.onAfterClose}
      ariaHideApp={false}
      style={{
        content: { background: "lightyellow" },
        overlay: { zIndex: 3000 },
      }}
    >
      <div style={{ height: "10%" }}>
        <div className="whole-menu">
          <div className="menu-left">
            <Typography
              variant="h5"
              style={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              How To Use
            </Typography>
          </div>
          <div className="menu-right">
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                props.setShowHowToUse(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
      <Typography
        variant="body1"
        style={{
          fontSize: "18px",
          lineHeight: "3",
          textAlign: "justify",
          textJustify: "inter-word",
          marginInline: "10%",
        }}
      >
        <ReactMarkDown children={markdownContent} />
      </Typography>
    </ReactModal>
  );
};
