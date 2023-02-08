// src/functions/unwrapName.ts
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { namehash } from "../utils/normalise.mjs";
import { checkIsDotEth } from "../utils/validation.mjs";
async function unwrapName_default({ contracts, signer }, name, {
  newController,
  newRegistrant
}) {
  const labels = name.split(".");
  const labelhash = solidityKeccak256(["string"], [labels[0]]);
  const parentNodehash = namehash(labels.slice(1).join("."));
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  if (checkIsDotEth(labels)) {
    if (!newRegistrant) {
      throw new Error("newRegistrant must be specified for .eth names");
    }
    return nameWrapper.populateTransaction.unwrapETH2LD(
      labelhash,
      newRegistrant,
      newController
    );
  }
  if (newRegistrant) {
    throw new Error("newRegistrant can only be specified for .eth names");
  }
  return nameWrapper.populateTransaction.unwrap(
    parentNodehash,
    labelhash,
    newController
  );
}
export {
  unwrapName_default as default
};
