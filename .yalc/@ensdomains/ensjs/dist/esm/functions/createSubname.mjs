// src/functions/createSubname.ts
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { encodeFuses } from "../utils/fuses.mjs";
import { namehash } from "../utils/normalise.mjs";
import { makeExpiry, wrappedLabelLengthCheck } from "../utils/wrapper.mjs";
async function createSubname_default({
  contracts,
  signer,
  getExpiry
}, name, { owner, resolverAddress, contract, ...wrapperArgs }) {
  const labels = name.split(".");
  if (labels.length === 1) {
    throw new Error("Subnames in ENS.js can only be created for 2LDs, not TLDs");
  }
  if ("fuses" in wrapperArgs && contract === "registry") {
    throw new Error("Fuses can only be set on a wrapped name");
  }
  if (!resolverAddress) {
    resolverAddress = (await contracts?.getPublicResolver()).address;
  }
  const label = labels.shift();
  const labelhash = solidityKeccak256(["string"], [label]);
  const parentNodehash = namehash(labels.join("."));
  switch (contract) {
    case "registry": {
      const registry = (await contracts.getRegistry()).connect(signer);
      return registry.populateTransaction.setSubnodeRecord(
        parentNodehash,
        labelhash,
        owner,
        resolverAddress,
        0
      );
    }
    case "nameWrapper": {
      wrappedLabelLengthCheck(label);
      const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
      const expiry = await makeExpiry(
        { getExpiry },
        name,
        "expiry" in wrapperArgs ? wrapperArgs.expiry : void 0
      );
      const generatedFuses = "fuses" in wrapperArgs && wrapperArgs.fuses ? encodeFuses(wrapperArgs.fuses) : 0;
      return nameWrapper.populateTransaction.setSubnodeRecord(
        parentNodehash,
        label,
        owner,
        resolverAddress,
        0,
        generatedFuses,
        expiry
      );
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`);
    }
  }
}
export {
  createSubname_default as default
};
