// src/functions/transferSubname.ts
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { namehash } from "../utils/normalise.mjs";
import { expiryToBigNumber } from "../utils/wrapper.mjs";
async function transferSubname_default({ contracts, signer }, name, { contract, owner, resolverAddress, ...wrapperArgs }) {
  const labels = name.split(".");
  const label = labels.shift();
  const labelhash = solidityKeccak256(["string"], [label]);
  const parentNodehash = namehash(labels.join("."));
  switch (contract) {
    case "registry": {
      const registry = (await contracts.getRegistry()).connect(signer);
      return registry.populateTransaction.setSubnodeOwner(
        parentNodehash,
        labelhash,
        owner
      );
    }
    case "nameWrapper": {
      const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
      const expiry = expiryToBigNumber(
        wrapperArgs.expiry,
        0
      );
      return nameWrapper.populateTransaction.setSubnodeOwner(
        parentNodehash,
        label,
        owner,
        "0",
        expiry
      );
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`);
    }
  }
}
export {
  transferSubname_default as default
};
