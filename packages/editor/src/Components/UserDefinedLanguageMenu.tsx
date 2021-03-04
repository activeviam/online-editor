import React from "react";

import "./Menu.css";

interface IProps {
  onClickParse: () => void;
}

export const UserDefinedLanguageMenu = (props: IProps) => {
  return (
    <ul className="menuright">
      <li>
        <button onClick={props.onClickParse}>
          Parse User Defined Language
        </button>
      </li>
    </ul>
  );
};
