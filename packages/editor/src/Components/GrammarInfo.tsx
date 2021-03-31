import React, { Fragment } from "react";

import { GrammarRequestResult } from "../Types/GrammarTypes";

interface IProps {
  grammarResponse: GrammarRequestResult | undefined;
}

export const GrammarInfo = (props: IProps) => {
  return (
    <Fragment>
      <ul>
        {props.grammarResponse && <h3>Tokens:</h3>}
        {props.grammarResponse
          ? props.grammarResponse.tokens.map((token: string, index: number) => (
              <li key={index}>{token}</li>
            ))
          : ""}
      </ul>
    </Fragment>
  );
};
