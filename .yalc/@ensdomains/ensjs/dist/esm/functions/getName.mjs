// src/functions/getName.ts
import { hexEncodeName } from "../utils/hexEncodedName.mjs";
var raw = async ({ contracts }, address) => {
  const universalResolver = await contracts?.getUniversalResolver();
  const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
  return {
    to: universalResolver.address,
    data: universalResolver.interface.encodeFunctionData("reverse(bytes)", [
      hexEncodeName(reverseNode)
    ])
  };
};
var decode = async ({ contracts }, data, address) => {
  if (data === null)
    return;
  const universalResolver = await contracts?.getUniversalResolver();
  try {
    const result = universalResolver.interface.decodeFunctionResult(
      "reverse(bytes)",
      data
    );
    return {
      name: result["0"],
      match: result["1"].toLowerCase() === address.toLowerCase(),
      reverseResolverAddress: result["2"],
      resolverAddress: result["3"]
    };
  } catch {
    return { name: void 0 };
  }
};
var getName_default = {
  raw,
  decode
};
export {
  getName_default as default
};
