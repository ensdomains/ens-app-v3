// src/functions/getResolver.ts
import { hexStripZeros } from "@ethersproject/bytes";
import { hexEncodeName } from "../utils/hexEncodedName.mjs";
var raw = async ({ contracts }, name) => {
  const universalResolver = await contracts?.getUniversalResolver();
  return {
    to: universalResolver.address,
    data: universalResolver.interface.encodeFunctionData("findResolver", [
      hexEncodeName(name)
    ])
  };
};
var decode = async ({ contracts }, data) => {
  const universalResolver = await contracts?.getUniversalResolver();
  const response = universalResolver.interface.decodeFunctionResult(
    "findResolver",
    data
  );
  if (!response || !response[0] || hexStripZeros(response[0]) === "0x") {
    return;
  }
  return response[0];
};
var getResolver_default = { raw, decode };
export {
  getResolver_default as default
};
