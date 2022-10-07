// src/functions/transferSubname.ts
import { ethers } from "ethers";
import { namehash } from "../utils/normalise.mjs";
import { makeExpiry } from "../utils/wrapper.mjs";
async function transferSubname_default({
  contracts,
  signer,
  getExpiry
}, name, { contract, owner, resolverAddress, ...wrapperArgs }) {
  const labels = name.split(".");
  const label = labels.shift();
  const labelhash = ethers.utils.solidityKeccak256(["string"], [label]);
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
      const expiry = await makeExpiry(
        { getExpiry },
        labels.join("."),
        "expiry" in wrapperArgs ? wrapperArgs.expiry : void 0
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
