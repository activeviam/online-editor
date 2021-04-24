import React from "react";

import { Button, TextField } from "@material-ui/core";

import "./Menu.css";

interface IProps {
  //onChangeVisitor: (visitor: string) => void;
  grammarRoot: string;
  onChangeRootNode: (rootNode: string) => void;
  onChangeFilePicker: (file: File) => void;
  onClickCompileGrammar: () => void;
}

export const GrammarMenu = (props: IProps) => {
  const handleFilePickerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files === null) {
      console.error("No file selected.");
      return;
    }
    props.onChangeFilePicker(e.target.files[0]);
  };

  return (
    <div className="whole-menu">
      <div className="menu-left">
        <form>
          <TextField
            onChange={(e) => {
              props.onChangeRootNode(e.target.value);
            }}
            placeholder="Grammar Root"
            label="grammar root"
            value={props.grammarRoot}
            error={props.grammarRoot === ""}
            helperText={
              props.grammarRoot === "" ? "Grammar Root Required!" : ""
            }
            size="small"
            color="secondary"
            required
          ></TextField>
        </form>
      </div>
      <div className="menu-right">
        <input
          className="invisible-input"
          id="contained-button-file"
          type="file"
          onChange={handleFilePickerInputChange}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="outlined"
            color="secondary"
            component="span"
            size="small"
          >
            Compile From File
          </Button>
        </label>

        <div className="divider"></div>
        <Button
          variant="outlined"
          color="secondary"
          onClick={props.onClickCompileGrammar}
          size="small"
        >
          Compile Grammar
        </Button>
      </div>
    </div>
  );
};
