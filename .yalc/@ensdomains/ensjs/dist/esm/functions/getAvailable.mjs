// src/functions/getAvailable.ts
import { labelhash } from "../utils/labels.mjs";
var raw = async ({ contracts }, name) => {
  const baseRegistrar = await contracts?.getBaseRegistrar();
  const labels = name.split(".");
  if (labels.length !== 2 || labels[1] !== "eth") {
    throw new Error("Currently only .eth names can be checked for availability");
  }
  return {
    to: baseRegistrar.address,
    data: baseRegistrar.interface.encodeFunctionData("available", [
      labelhash(labels[0])
    ])
  };
};
var decode = async ({ contracts }, data) => {
  if (data === null)
    return;
  const baseRegistrar = await contracts?.getBaseRegistrar();
  try {
    const result = baseRegistrar.interface.decodeFunctionResult(
      "available",
      data
    );
    return result["0"];
  } catch {
    return;
  }
};
var getAvailable_default = {
  raw,
  decode
};
export {
  getAvailable_default as default
};
