// src/functions/transferName.ts
import { ethers } from "ethers";
import { namehash } from "../utils/normalise.mjs";
async function transferName_default({ contracts, signer }, name, {
  newOwner,
  contract
}) {
  const address = await signer.getAddress();
  switch (contract) {
    case "registry": {
      const registry = (await contracts?.getRegistry()).connect(signer);
      return registry.populateTransaction.setOwner(namehash(name), newOwner);
    }
    case "baseRegistrar": {
      const baseRegistrar = (await contracts?.getBaseRegistrar()).connect(
        signer
      );
      const labels = name.split(".");
      if (labels.length > 2 || labels[labels.length - 1] !== "eth") {
        throw new Error("Invalid name for baseRegistrar");
      }
      return baseRegistrar.populateTransaction["safeTransferFrom(address,address,uint256)"](
        address,
        newOwner,
        ethers.utils.solidityKeccak256(["string"], [labels[0]])
      );
    }
    case "nameWrapper": {
      const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
      return nameWrapper.populateTransaction.safeTransferFrom(
        address,
        newOwner,
        namehash(name),
        1,
        "0x"
      );
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`);
    }
  }
}
export {
  transferName_default as default
};
