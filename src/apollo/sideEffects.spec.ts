import { getReverseRecord } from "./sideEffects";

jest.mock("./reactiveVars", () => ({
  isENSReadyReactive: jest.fn(),
}));

jest.mock("./mutations/ens", () => ({
  default: jest.fn(),
}));

const { isENSReadyReactive } = require("./reactiveVars");
const { default: getENS } = require("./mutations/ens");

describe("getReverseRecord", () => {
  it("should return the default object if ens is not ready", async () => {
    isENSReadyReactive.mockImplementation(() => false);
    expect(await getReverseRecord("0xaddress")).toEqual({
      name: null,
      match: false,
    });
  });

  it("should return the default object if no address is given", async () => {
    isENSReadyReactive.mockImplementation(() => true);
    expect(await getReverseRecord()).toEqual({ name: null, match: false });
  });

  it("should return the default object when there is an error", async () => {
    getENS.mockImplementation(() => undefined);
    isENSReadyReactive.mockImplementation(() => true);
    expect(await getReverseRecord("0xasdfasd")).toEqual({
      name: null,
      match: false,
    });
  });

  it.todo(
    "should return reverse record if ens is ready and address has a reverse record"
  );
});
