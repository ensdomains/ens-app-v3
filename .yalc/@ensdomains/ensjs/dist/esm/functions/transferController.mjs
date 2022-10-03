// src/functions/transferController.ts
import { ethers } from "ethers";
async function transferController_default({ contracts, signer }, name, {
  newOwner,
  isOwner
}) {
  const baseRegistrar = (await contracts?.getBaseRegistrar()).connect(signer);
  const registry = (await contracts?.getRegistry()).connect(signer);
  const labels = name.split(".");
  if (isOwner) {
    return registry.populateTransaction.setOwner(
      ethers.utils.solidityKeccak256(["string"], [labels[0]]),
      newOwner
    );
  }
  return baseRegistrar.populateTransaction.reclaim(
    ethers.utils.solidityKeccak256(["string"], [labels[0]]),
    newOwner
  );
}
export {
  transferController_default as default
};
