// src/functions/setResolver.ts
import { namehash } from "../utils/normalise.mjs";
async function setResolver_default({ contracts, signer }, name, {
  contract,
  resolver
}) {
  if (!resolver) {
    resolver = (await contracts.getPublicResolver()).address;
  }
  switch (contract) {
    case "registry": {
      const registry = (await contracts?.getRegistry()).connect(signer);
      return registry.populateTransaction.setResolver(namehash(name), resolver);
    }
    case "nameWrapper": {
      const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
      return nameWrapper.populateTransaction.setResolver(
        namehash(name),
        resolver
      );
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`);
    }
  }
}
export {
  setResolver_default as default
};
