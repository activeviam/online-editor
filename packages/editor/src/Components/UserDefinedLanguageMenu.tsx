import React from "react";

import "./Menu.css";

import {
  parseUserDefinedLanguage,
  ParsedType,
} from "@online-editor-2020/editor/src/requests";

interface IProps {
  userDefinedLanguage: string;
  onChangeParsed: (parsed: ParsedType) => void;
}

export const UserDefinedLanguageMenu = (props: IProps) => {
  const parseOnClickHandler = () => {
    parseUserDefinedLanguage(props.userDefinedLanguage).then((parsed) => {
      props.onChangeParsed(parsed);
    });
  };

  return (
    <div className="menu">
      <button onClick={parseOnClickHandler}>Parse User Defined Language</button>
    </div>
  );
};
