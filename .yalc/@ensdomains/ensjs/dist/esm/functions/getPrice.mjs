// src/functions/getPrice.ts
import { defaultAbiCoder } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
var raw = async ({ contracts, multicallWrapper }, nameOrNames, duration, legacy) => {
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
  if (names.length > 1) {
    const bulkRenewal = await contracts?.getBulkRenewal();
    const baseCall2 = {
      to: bulkRenewal.address,
      data: bulkRenewal.interface.encodeFunctionData("rentPrice", [
        names,
        duration
      ])
    };
    if (legacy) {
      return multicallWrapper.raw([
        baseCall2,
        {
          to: bulkRenewal.address,
          data: bulkRenewal.interface.encodeFunctionData("rentPrice", [
            names,
            0
          ])
        }
      ]);
    }
    return baseCall2;
  }
  const controller = await contracts?.getEthRegistrarController();
  const baseCall = {
    to: controller.address,
    data: controller.interface.encodeFunctionData("rentPrice", [
      names[0],
      duration
    ])
  };
  if (legacy) {
    return multicallWrapper.raw([
      baseCall,
      {
        to: controller.address,
        data: controller.interface.encodeFunctionData("rentPrice", [
          names[0],
          0
        ])
      }
    ]);
  }
  return baseCall;
};
var decode = async ({ contracts, multicallWrapper }, data, _nameOrNames, _duration, legacy) => {
  if (data === null)
    return;
  try {
    let base;
    let premium;
    const isBulkRenewal = Array.isArray(_nameOrNames) && _nameOrNames.length > 1;
    if (isBulkRenewal && legacy) {
      const result = await multicallWrapper.decode(data);
      const [price] = defaultAbiCoder.decode(
        ["uint256"],
        result[0].returnData
      );
      [premium] = defaultAbiCoder.decode(
        ["uint256"],
        result[1].returnData
      );
      base = price.sub(premium);
    } else if (isBulkRenewal) {
      const bulkRenewal = await contracts?.getBulkRenewal();
      const result = bulkRenewal.interface.decodeFunctionResult(
        "rentPrice",
        data
      );
      [base] = result;
      premium = BigNumber.from(0);
    } else if (!isBulkRenewal && legacy) {
      const result = await multicallWrapper.decode(data);
      const [price] = defaultAbiCoder.decode(
        ["uint256"],
        result[0].returnData
      );
      [premium] = defaultAbiCoder.decode(
        ["uint256"],
        result[1].returnData
      );
      base = price.sub(premium);
    } else {
      const controller = await contracts?.getEthRegistrarController();
      const result = controller.interface.decodeFunctionResult(
        "rentPrice",
        data
      );
      [base, premium] = result[0];
    }
    return {
      base,
      premium
    };
  } catch {
    return;
  }
};
var getPrice_default = { raw, decode };
export {
  getPrice_default as default
};
