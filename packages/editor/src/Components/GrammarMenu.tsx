import React from "react";

import "./Menu.css";

interface IProps {
  //onChangeVisitor: (visitor: string) => void;
  onChangeRootNode: (rootNode: string) => void;
  onChangeFilePicker: (file: File) => void;
  onClickCompileGrammar: () => void;
  onClickCompileGrammarFromFile: () => void;
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
    <div>
      <ul className="menuleft">
        <li>
          <input
            type="file"
            name="file"
            required
            onChange={handleFilePickerInputChange}
          ></input>
        </li>
        <li>
          <button onClick={props.onClickCompileGrammarFromFile}>
            Compile Grammar from File
          </button>
        </li>
      </ul>
      <ul className="menuright">
        <li>
          <form>
            <input
              onChange={(e) => {
                props.onChangeRootNode(e.target.value);
              }}
              placeholder="Grammar Root Node"
            ></input>
          </form>
        </li>
        <li>
          <button onClick={props.onClickCompileGrammar}>Compile Grammar</button>
        </li>
      </ul>
    </div>
  );
};
