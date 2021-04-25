# ANTLR TypeScript Visualization Toolkit

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## Overview

**ANTLR TypeScript Visualization Toolkit** is a web
application that aims to be an intuitive, easy to use front end to the
[ANTLR parser generator][]. You can develop a grammar, specify a theme,
compose the text to be parsed and dynamically visualize its parsed
tree. All the features are available on the fly without having to deal
with the ANTLR java executable. The objective of this application is
to attract new users who don't have much familiarity with ANTLR,
but these tools can still be useful to more advanced users. Being a
web application, it allows for versatile deployment strategies, e.g.,
a local integrated application (similar to Jupyter Notebook, an
emblematic example of a web application whose adoption turned massive
for Python development, especially in Data Science), a Docker image,
an Electron desktop application, or even just being hosted online on a
live website with a cool address.

Still confused? See a [demo gif][].

## How to use

Make sure you have a JRE available on your system (see [antlr4ts requirements][]).

Clone the repository and then at its root directory:

```
$ yarn
$ yarn start
```

This will launch both the front end and the back end thanks to [lerna][].

Docker image and live deployment coming soon...

## Contribute

If you would like to help add new features or improve anything please send any of us a message or raise an issue. Contributions would be greatly appreciated and we can help you get onboard :).

## List of Features

### Grammar Editor

A monaco editor that allows the user to define their ANTLR grammar to
define their DSL. This editor features textmate based syntax
highlighting with the [Complete Light][] theme. Grammars can also be
uploaded from files.

### Theme Selection

After compiling the grammar, users can attribute colors to tokens to
customize how the tokenization features will look. There are two theme
modes:

-   Sequential Theme: colors will be attributed to tokens in order
    of appearance by using a certain color palette. Users can change the
    color palette to be used. Currently there are four color palettes in
    the project (OneLightUI, Complete Light, Light Ocean Colors, GitHub
    Light). Optionally can match open and close symbols (for example
    match parentheses’ colors).

-   Custom Theme: inherits all colors initially from last selected sequential
    theme. Then users can individually attribute colors to tokens by
    using a color picker. Can be reset at any time.

### Tokenize Editor

This editor accepts the user grammar defined DSL. Its contents are also used for
the next feature, the parse tree.

-   Syntax Highlighting: each token is highlighted with the color
    attributed by the selected theme.

-   Hover: when mouse hovers a word, shows the name of the token.

-   Autocomplete: for generic tokens, i.e., tokens that have been
    implicitly defined in the grammar, e.g., ’program’.

-   Autotokenize: users can activate autotokenize to parse the
    editor’s contents automatically when they change.

### Interactive Parse Tree

The parsed tree for the input in the Tokenize Editor. It is interactive
in the sense that it can be moved around with the mouse and rules can be
expanded or collapsed.

-   Initial Depth: the parse tree can grow really fast. The user can
    change what the initial depth of the tree should be (defaults to 2).

-   Orientation: users can choose between a vertical or a horizontal
    tree (defaults to vertical).

-   Full-screen: the tree can also be viewed in full-screen (helpful for bigger trees).

### Error Handling

Some of the requests in our program might fail for a variety
of reasons. We have error handling to manage these situations in both
the frontend and the backend.

-   After grammar compilation, grammar warnings are shown as a popup that
the user can close. Grammar errors, on the other hand, replace the theme
definer (we don’t have any tokens anyway when grammar compilation
fails).

-   In a similar fashion, tokenize errors can replace the interactive parse
tree when they exist. This replacement has shown itself performant
enough to not be a problem even when changing the text with auto
tokenize turned on.

  [Complete Light]: https://github.com/mike-lischke/vscode-antlr4#syntax-coloring
  [ANTLR Parser Generator]: https://www.antlr.org/
  [antlr4ts requirements]: https://github.com/tunnelvisionlabs/antlr4ts#requirements
  [lerna]: https://lerna.js.org/
  [demo gif]: antlr_tvt_demo.gif