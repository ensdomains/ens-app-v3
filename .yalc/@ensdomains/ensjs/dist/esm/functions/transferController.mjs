// src/functions/transferController.ts
import { ethers } from "ethers";
async function transferController_default({ contracts, signer }, name, {
  newOwner
}) {
  const baseRegistrar = (await contracts?.getBaseRegistrar()).connect(signer);
  const labels = name.split(".");
  if (labels.length > 2 || labels[labels.length - 1] !== "eth") {
    throw new Error("Invalid name for baseRegistrar");
  }
  return baseRegistrar.populateTransaction.reclaim(
    ethers.utils.solidityKeccak256(["string"], [labels[0]]),
    newOwner
  );
}
export {
  transferController_default as default
};
