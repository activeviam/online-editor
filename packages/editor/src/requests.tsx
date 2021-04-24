import axios from "axios";

import { ParsedCustomLanguage } from "./Types/TokenizeTypes";
import { GrammarRequestResult } from "./Types/GrammarTypes";

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
): Promise<GrammarRequestResult> => {
  const grammarResponse = await axios
    .post(
      requestUrl + process.env.REACT_APP_ENDPOINT_UPLOAD_GRAMMAR,
      {
        grammar: grammar,
        grammarRoot: rootNode,
      },
      { withCredentials: true }
    )
    .then((response) => response.data)
    .catch(console.error);

  return grammarResponse;
};

export const parseCustomLanguage = async (
  userDefinedLanguage: string
): Promise<ParsedCustomLanguage> => {
  const parsed = await axios
    .post(
      requestUrl + process.env.REACT_APP_ENDPOINT_PARSE,
      {
        code: userDefinedLanguage,
      },
      { withCredentials: true }
    )
    .then((response) => response.data)
    .catch(console.error);
  return parsed;
};
