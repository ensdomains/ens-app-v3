// src/functions/deleteSubname.ts
import { keccak256 as solidityKeccak256 } from "@ethersproject/solidity";
import { namehash } from "../utils/normalise.mjs";
async function deleteSubname_default({ contracts, signer }, name, { contract, ...args }) {
  const labels = name.split(".");
  if (labels.length < 3) {
    throw new Error(`${name} is not a valid subname`);
  }
  switch (contract) {
    case "registry": {
      const registry = (await contracts.getRegistry()).connect(signer);
      const label = labels.shift();
      const labelhash = solidityKeccak256(["string"], [label]);
      const parentNodehash = namehash(labels.join("."));
      return registry.populateTransaction.setSubnodeRecord(
        parentNodehash,
        labelhash,
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
        0
      );
    }
    case "nameWrapper": {
      const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
      const { method } = args;
      if (method === "setRecord") {
        const node = namehash(name);
        return nameWrapper.populateTransaction.setRecord(
          node,
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000",
          0
        );
      }
      const label = labels.shift();
      const parentNodehash = namehash(labels.join("."));
      return nameWrapper.populateTransaction.setSubnodeOwner(
        parentNodehash,
        label,
        "0x0000000000000000000000000000000000000000",
        0,
        0
      );
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`);
    }
  }
}
export {
  deleteSubname_default as default
};
