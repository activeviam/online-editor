import React from "react";

/*
Component that contains the grammar editor and its menu.
*/

import { editor } from "monaco-editor";
import { useLocalStorage } from "react-use";

import { helloGrammar } from "../GrammarExamples/HelloGrammar";
import { uploadGrammar, uploadGrammarFromFile } from "../requests";
import { GrammarEditor } from "./GrammarEditor";
import { GrammarMenu } from "./GrammarMenu";
import { ThemeMode } from "../TokenizeTheme";

import { GrammarRequestResult } from "../Types/GrammarTypes";

import "./Panes.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
  isGrammarCompiled: boolean | undefined;
  sequentialPaletteId: string | undefined;
  themeMode: ThemeMode | undefined;
  setIsGrammarCompiled: (isIt: boolean) => void;
  setGrammarResponse: (response: GrammarRequestResult) => void;
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
    if (grammarResponse !== undefined) {
      props.setGrammarResponse(grammarResponse);
      props.setIsGrammarCompiled(true);
    } else {
      props.setIsGrammarCompiled(false);
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
