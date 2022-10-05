// src/functions/batchWrappers.ts
import { hexEncodeName } from "../utils/hexEncodedName.mjs";
var universalWrapper = {
  raw: async ({ contracts }, name, data) => {
    const universalResolver = await contracts?.getUniversalResolver();
    return {
      to: universalResolver.address,
      data: universalResolver.interface.encodeFunctionData("resolve", [
        hexEncodeName(name),
        data
      ])
    };
  },
  decode: async ({ contracts }, data) => {
    const universalResolver = await contracts?.getUniversalResolver();
    const response = universalResolver.interface.decodeFunctionResult(
      "resolve",
      data
    );
    if (!response || !response[0]) {
      return;
    }
    return { data: response[0], resolver: response[1] };
  }
};
var resolverMulticallWrapper = {
  raw: async ({ contracts }, data) => {
    const publicResolver = await contracts?.getPublicResolver();
    const formattedDataArr = data.map((item) => item.data);
    return {
      to: publicResolver.address,
      data: publicResolver.interface.encodeFunctionData("multicall", [
        formattedDataArr
      ])
    };
  },
  decode: async ({ contracts }, data) => {
    const publicResolver = await contracts?.getPublicResolver();
    const response = publicResolver.interface.decodeFunctionResult(
      "multicall",
      data
    );
    if (!response) {
      return;
    }
    return response;
  }
};
var multicallWrapper = {
  async raw({ contracts }, transactions, requireSuccess = false) {
    const multicall = await contracts?.getMulticall();
    return {
      to: multicall.address,
      data: multicall.interface.encodeFunctionData("tryAggregate", [
        requireSuccess,
        transactions.map((tx) => ({
          target: tx.to,
          callData: tx.data
        }))
      ])
    };
  },
  async decode({ contracts }, data) {
    if (!data)
      return;
    const multicall = await contracts?.getMulticall();
    try {
      const [result] = multicall.interface.decodeFunctionResult(
        "tryAggregate",
        data
      );
      return result;
    } catch {
      return;
    }
  }
};
export {
  multicallWrapper,
  resolverMulticallWrapper,
  universalWrapper
};
