import React, { useEffect } from "react";

/*
Component that contains the grammar editor and its menu.
*/

import { editor } from "monaco-editor";
import { useLocalStorage } from "react-use";

import { helloGrammar } from "../GrammarExamples/HelloGrammar";
import { uploadGrammar, uploadGrammarFromFile } from "../requests";
import { GrammarEditor } from "./GrammarEditor";
import { GrammarMenu } from "./GrammarMenu";
import {
  SequentialThemeProvider,
  TokenizeThemeProvider,
} from "../TokenizeTheme";

import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./Panes.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
  isGrammarCompiled: boolean | undefined;
  sequentialPaletteId: string | undefined;
  themeMode: string | undefined;
  themeProvider: TokenizeThemeProvider | undefined;
  setIsGrammarCompiled: (isIt: boolean) => void;
  setGrammarResponse: (response: GrammarRequestResult) => void;
  setThemeProvider: (themeProvider: TokenizeThemeProvider | undefined) => void;
}

export const GrammarTools = (props: IProps) => {
  const [grammar, setGrammar] = useLocalStorage("userGrammar", helloGrammar);
  const [grammarRoot, setGrammarRoot] = useLocalStorage("grammarRoot", "root"); // Grammar Root Node

  const handleGrammarChange = (
    changedGrammar: string | undefined,
    ev: editor.IModelContentChangedEvent
  ) => {
    if (changedGrammar === undefined) {
      console.error("Undefined grammar state.");
      return;
    }
    setGrammar(changedGrammar);
    if (ev.changes.length && props.isGrammarCompiled !== false) {
      props.setIsGrammarCompiled(false);
    }
  };

  const handleCompileGrammarClick = async () => {
    if (grammarRoot === undefined || grammarRoot === "") {
      console.error("No Grammar Root defined.");
      return;
    } else if (grammar === undefined || grammar === "") {
      console.error("No Grammar defined.");
      return;
    }
    const grammarResponse = await uploadGrammar(grammar, grammarRoot);
    props.setGrammarResponse(grammarResponse);
    if (props.isGrammarCompiled !== true) {
      props.setIsGrammarCompiled(true);
    }
  };

  const handleFilePickChange = async (file: File) => {
    if (file === undefined) {
      console.error("File is undefined.");
      return;
    } else if (grammarRoot === undefined) {
      console.error("No Grammar Root defined.");
      return;
    }
    const fileGrammar = await file.text();
    setGrammar(fileGrammar);
    const grammarResponse = await uploadGrammarFromFile(file, grammarRoot);
    props.setGrammarResponse(grammarResponse);
  };

  const { grammarResponse, sequentialPaletteId, setThemeProvider } = props;
  useEffect(() => {
    if (grammarResponse !== undefined && sequentialPaletteId !== undefined) {
      const tokenPragmaticIds = grammarResponse.tokens;
      if (tokenPragmaticIds.length > 0) {
        setThemeProvider(
          new SequentialThemeProvider(tokenPragmaticIds, sequentialPaletteId)
        );
      }
    }
  }, [grammarResponse, sequentialPaletteId, setThemeProvider]);

  return (
    <div className="whole-pane">
      <div className="grammar-menu">
        <GrammarMenu
          //onChangeVisitor={setVisitor}
          grammarRoot={grammarRoot || ""}
          onChangeRootNode={setGrammarRoot}
          onChangeFilePicker={handleFilePickChange}
          onClickCompileGrammar={handleCompileGrammarClick}
        />
      </div>
      <div className="editor">
        <GrammarEditor
          defaultLanguage="antlr"
          value={grammar}
          onChange={handleGrammarChange}
        />
      </div>
    </div>
  );
};
