"use strict";

var _parse = require("./parse");

describe("parse", () => {
  it("says hello", () => {
    console.log = jest.fn();
    (0, _parse.parse)("Moad and Stefano");
    expect(console.log.mock.calls[0][0]).toBe("Hello Moad and Stefano!");
  });
});