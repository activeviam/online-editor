import { parse } from "./parse";

describe("parse", () => {
  it("says hello", () => {
    console.log = jest.fn();
    parse("Moad and Stefano");
    expect((console.log as jest.Mock).mock.calls[0][0]).toBe(
      "Hello Moad and Stefano!",
    );
  });
});
