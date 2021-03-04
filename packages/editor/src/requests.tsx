import axios from "axios";

export const uploadGrammarFromFile = async (selectedFile: File) => {
  if (selectedFile) {
    const data = new FormData();
    data.append("file", selectedFile);
    //const visitor = await axios
    await axios
      .post("http://localhost:5000/generate-visitor-from-file", data, {
        withCredentials: true,
      })
      //.then((response) => response.data.visitor)
      .catch((error) => console.log(error));
    //return visitor;
  }
};

export const uploadGrammar = async (grammar: string) => {
  //const visitor = await axios
  await axios
    .post(
      "http://localhost:5000/generate-visitor",
      {
        grammar: grammar,
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
      "http://localhost:5000/parse",
      {
        userDefinedLanguage: userDefinedLanguage,
      },
      { withCredentials: true }
    )
    .then((response) => response.data.parsed)
    .catch(console.error);
  return parsed;
};
