// src/functions/getRecords.ts
import { parseInputType } from "../utils/validation.mjs";
async function getRecords_default({ getProfile }, name, options) {
  const inputType = parseInputType(name);
  if (inputType.type !== "name" && inputType.type !== "label") {
    throw new Error("Input must be an ENS name");
  }
  return getProfile(name, options);
}
export {
  getRecords_default as default
};
