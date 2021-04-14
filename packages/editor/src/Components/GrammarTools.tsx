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

import {
  instanceOfGrammarRequestResult,
  instanceOfGrammarRequestError,
  GrammarRequestResult,
  GrammarRequestError,
} from "../Types/GrammarTypes";

import "./Panes.css";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
  grammarError: GrammarRequestError | undefined;
  isGrammarCompiled: boolean | undefined;
  sequentialPaletteId: string | undefined;
  themeMode: ThemeMode | undefined;
  setIsGrammarCompiled: (isIt: boolean) => void;
  setShowWarning: (newShowWarning: boolean) => void;
  setShowGrammarError: (newShowGrammarError: boolean) => void;
  setGrammarResponse: (response: GrammarRequestResult) => void;
  setGrammarError: (error: GrammarRequestError | undefined) => void;
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

  const processGrammarResponse = (
    grammarResponse: GrammarRequestResult | GrammarRequestError | undefined
  ) => {
    try {
      if (grammarResponse === undefined) {
        props.setIsGrammarCompiled(false);
        return;
      } else if (instanceOfGrammarRequestResult(grammarResponse)) {
        props.setGrammarResponse(grammarResponse);
        props.setIsGrammarCompiled(true);
        props.setGrammarError(undefined);
        props.setShowGrammarError(false);
        if (
          grammarResponse.warnings !== undefined &&
          grammarResponse.warnings.length > 0
        ) {
          props.setShowWarning(true);
        }
      } else if (instanceOfGrammarRequestError(grammarResponse)) {
        props.setIsGrammarCompiled(false);
        props.setGrammarError(grammarResponse);
        props.setShowGrammarError(true);
      }
    } catch (e) {
      console.error(
        `Error processing grammar response. Received exception ${e}`
      );
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
    processGrammarResponse(grammarResponse);
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
    processGrammarResponse(grammarResponse);
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
          setGrammar={setGrammar}
          onChange={handleGrammarChange}
        />
      </div>
    </div>
  );
};
