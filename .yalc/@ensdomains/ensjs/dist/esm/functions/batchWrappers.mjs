// src/functions/batchWrappers.ts
import ccipLookup from "../utils/ccip.mjs";
import { hexEncodeName } from "../utils/hexEncodedName.mjs";
var universalWrapper = {
  raw: async ({ contracts }, name, data) => {
    const universalResolver = await contracts?.getUniversalResolver();
    return {
      to: universalResolver.address,
      data: universalResolver.interface.encodeFunctionData(
        "resolve(bytes,bytes)",
        [hexEncodeName(name), data]
      )
    };
  },
  decode: async ({ contracts }, data) => {
    const universalResolver = await contracts?.getUniversalResolver();
    const response = universalResolver.interface.decodeFunctionResult(
      "resolve(bytes,bytes)",
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
  async decode({ contracts, provider }, data, transactions) {
    if (!data)
      return;
    const multicall = await contracts?.getMulticall();
    try {
      const [result] = multicall.interface.decodeFunctionResult(
        "tryAggregate",
        data
      );
      const ccipChecked = await Promise.all(
        result.map(
          async ([success, returnData], i) => {
            let newArr = [success, returnData];
            if (!success && returnData.startsWith("0x556f1830")) {
              try {
                const newData = await ccipLookup(
                  provider,
                  transactions[i],
                  returnData
                );
                if (newData) {
                  newArr = [true, newData];
                }
              } catch {
              }
            }
            return {
              ...newArr,
              success: newArr[0],
              returnData: newArr[1]
            };
          }
        )
      );
      return ccipChecked;
    } catch (e) {
      console.error(e);
      return;
    }
  }
};
export {
  multicallWrapper,
  resolverMulticallWrapper,
  universalWrapper
};
