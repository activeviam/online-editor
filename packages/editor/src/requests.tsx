import axios from "axios";

const requestUrl = `${process.env.REACT_APP_REQUEST_BASE_URL}:${process.env.REACT_APP_REQUEST_PORT}`;

export const uploadGrammarFromFile = async (
  selectedFile: File,
  rootNode: string
) => {
  if (selectedFile) {
    const data = new FormData();
    data.append("file", selectedFile);
    data.append("grammarRoot", rootNode);
    //const visitor = await axios
    await axios
      .post(
        requestUrl + process.env.REACT_APP_ENDPOINT_UPLOAD_GRAMMAR_FROM_FILE,
        data,
        {
          withCredentials: true,
        }
      )
      //.then((response) => response.data.visitor)
      .catch(console.error);
    //return visitor;
  }
};

export const uploadGrammar = async (grammar: string, rootNode: string) => {
  //const visitor = await axios
  await axios
    .post(
      requestUrl + process.env.REACT_APP_ENDPOINT_UPLOAD_GRAMMAR,
      {
        grammar: grammar,
        rootNode: rootNode,
      },
      { withCredentials: true }
    )
    //.then((response) => [response.data.visitor])
    .catch(console.error);
  //return visitor;
};

export type ParsedType = string;

export const parseUserDefinedLanguage = async (
  userDefinedLanguage: string
): Promise<ParsedType> => {
  const parsed = await axios
    .post(
      requestUrl + process.env.REACT_APP_ENDPOINT_PARSE,
      {
        userDefinedLanguage: userDefinedLanguage,
      },
      { withCredentials: true }
    )
    .then((response) => response.data.parsed)
    .catch(console.error);
  return parsed;
};
