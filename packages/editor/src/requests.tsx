import axios from "axios";

import { ParsedCustomLanguage, ParseError } from "./Types/TokenizeTypes";
import {
  GrammarRequestError,
  GrammarRequestResult,
} from "./Types/GrammarTypes";

const requestUrl = `${process.env.REACT_APP_REQUEST_BASE_URL}:${process.env.REACT_APP_REQUEST_PORT}`;

export const uploadGrammarFromFile = async (
  selectedFile: File,
  rootNode: string
): Promise<GrammarRequestResult> => {
  const data = new FormData();
  data.append("file", selectedFile);
  data.append("grammarRoot", rootNode);
  const grammarResponse = await axios
    .post(
      requestUrl + process.env.REACT_APP_ENDPOINT_UPLOAD_GRAMMAR_FROM_FILE,
      data,
      {
        withCredentials: true,
      }
    )
    .then((response) => response.data)
    .catch(console.error);
  return grammarResponse;
};

export const uploadGrammar = async (
  grammar: string,
  rootNode: string
): Promise<GrammarRequestResult | GrammarRequestError | undefined> => {
  const grammarResponse = await axios
    .post(
      requestUrl + process.env.REACT_APP_ENDPOINT_UPLOAD_GRAMMAR,
      {
        grammar: grammar,
        grammarRoot: rootNode,
      },
      { withCredentials: true }
    )
    .then((response) => response.data as GrammarRequestResult)
    .catch((error) => {
      if (error.response === undefined) {
        console.error("Didn't receive response to grammar compile request.");
        return undefined;
      }
      const errorCode = error.response.status;
      if (errorCode === 400) {
        return error.response.data as GrammarRequestError;
      } else {
        console.error(
          `Received unknown error code ${errorCode} on grammar compile request.`
        );
        return undefined;
      }
    });

  return grammarResponse;
};

export const parseCustomLanguage = async (
  userDefinedLanguage: string
): Promise<ParsedCustomLanguage | ParseError[] | undefined> => {
  const parsed = await axios
    .post(
      requestUrl + process.env.REACT_APP_ENDPOINT_PARSE,
      {
        code: userDefinedLanguage,
      },
      { withCredentials: true }
    )
    .then((response) => {
      const parsedCustomLanguage = response.data as ParsedCustomLanguage;
      if (parsedCustomLanguage.lexerErrors.length > 0) {
        return parsedCustomLanguage.lexerErrors;
      }
      return parsedCustomLanguage;
    })
    .catch((error) => {
      const errorCode = error.response.status;
      console.error(
        `Received unknown error code ${errorCode} on tokenize request.`
      );
      return undefined;
    });
  return parsed;
};
