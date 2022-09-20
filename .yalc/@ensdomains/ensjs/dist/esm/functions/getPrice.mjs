// src/functions/getPrice.ts
import { utils } from "ethers";
var raw = async ({ contracts, multicallWrapper }, name, duration, legacy) => {
  const controller = await contracts?.getEthRegistrarController();
  const baseCall = {
    to: controller.address,
    data: controller.interface.encodeFunctionData("rentPrice", [
      name,
      duration
    ])
  };
  if (legacy) {
    return multicallWrapper.raw([
      baseCall,
      {
        to: controller.address,
        data: controller.interface.encodeFunctionData("rentPrice", [name, 0])
      }
    ]);
  }
  return baseCall;
};
var decode = async ({ contracts, multicallWrapper }, data, _name, _number, legacy) => {
  if (data === null)
    return;
  const controller = await contracts?.getEthRegistrarController();
  try {
    let base;
    let premium;
    if (legacy) {
      const result = await multicallWrapper.decode(data);
      const [price] = utils.defaultAbiCoder.decode(
        ["uint256"],
        result[0].returnData
      );
      [premium] = utils.defaultAbiCoder.decode(
        ["uint256"],
        result[1].returnData
      );
      base = price.sub(premium);
    } else {
      ;
      [[base, premium]] = controller.interface.decodeFunctionResult(
        "rentPrice",
        data
      );
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
