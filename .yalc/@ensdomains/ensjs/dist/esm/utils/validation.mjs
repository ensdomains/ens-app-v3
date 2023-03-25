// src/utils/validation.ts
import { isAddress } from "@ethersproject/address";
import { isEncodedLabelhash, saveName } from "./labels.mjs";
import { normalise } from "./normalise.mjs";
var validateName = (name) => {
  const nameArray = name.split(".");
  const hasEmptyLabels = nameArray.some((label) => label.length === 0);
  if (hasEmptyLabels)
    throw new Error("Name cannot have empty labels");
  const normalizedArray = nameArray.map((label) => {
    if (label === "[root]") {
      return label;
    }
    return isEncodedLabelhash(label) ? label : normalise(label);
  });
  const normalizedName = normalizedArray.join(".");
  saveName(normalizedName);
  return normalizedName;
};
var validateTLD = (name) => {
  const labels = name.split(".");
  return validateName(labels[labels.length - 1]);
};
var parseInputType = (input) => {
  const validTLD = validateTLD(input);
  const regex = /[^.]+$/;
  try {
    validateName(input);
  } catch (e) {
    return {
      type: "unknown"
    };
  }
  if (input.indexOf(".") !== -1) {
    const termArray = input.split(".");
    const tld = input.match(regex) ? input.match(regex)[0] : "";
    if (validTLD) {
      if (tld === "eth" && [...termArray[termArray.length - 2]].length < 3) {
        return {
          type: "name",
          info: "short"
        };
      }
      return {
        type: "name",
        info: "supported"
      };
    }
    return {
      type: "name",
      info: "unsupported"
    };
  }
  if (isAddress(input)) {
    return {
      type: "address"
    };
  }
  return {
    type: "label"
  };
};
var checkIsDotEth = (labels) => labels.length === 2 && labels[1] === "eth";
export {
  checkIsDotEth,
  parseInputType,
  validateName,
  validateTLD
};
