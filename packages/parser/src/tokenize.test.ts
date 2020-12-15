import { tokenize } from "./tokenize";

test("const a = 1", () => {
  const tokens = tokenize("const a = 1");
  const expected_values = [
    {
      type: "kw-const",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "identifier",
      value: "a",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "operator",
      value: "=",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "number",
      value: 1,
    },
  ];
  for (let i = 0; i < tokens.length; i++) {
    expect(tokens[i].type).toBe(expected_values[i].type);
    expect(tokens[i].value).toBe(expected_values[i].value);
  }
});
