// src/functions/wrapName.ts
import { ethers } from "ethers";
import generateFuseInput from "../utils/generateFuseInput.mjs";
import { hexEncodeName } from "../utils/hexEncodedName.mjs";
import { makeExpiry } from "../utils/wrapperExpiry.mjs";
async function wrapETH({ contracts }, labels, wrappedOwner, expiry, decodedFuses, resolverAddress, signer, address) {
  const nameWrapper = await contracts?.getNameWrapper();
  const baseRegistrar = (await contracts.getBaseRegistrar()).connect(signer);
  const labelhash = ethers.utils.solidityKeccak256(["string"], [labels[0]]);
  const data = ethers.utils.defaultAbiCoder.encode(
    ["string", "address", "uint32", "uint64", "address"],
    [labels[0], wrappedOwner, decodedFuses, expiry, resolverAddress]
  );
  return baseRegistrar.populateTransaction["safeTransferFrom(address,address,uint256,bytes)"](address, nameWrapper.address, labelhash, data);
}
async function wrapOther({ contracts }, name, wrappedOwner, resolverAddress, address, signer) {
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  const registry = await contracts?.getRegistry();
  const hasApproval = await registry.isApprovedForAll(
    address,
    nameWrapper.address
  );
  if (!hasApproval) {
    throw new Error(
      "NameWrapper must have approval to wrap a name from this address."
    );
  }
  return nameWrapper.populateTransaction.wrap(
    hexEncodeName(name),
    wrappedOwner,
    resolverAddress
  );
}
async function wrapName_default({
  contracts,
  signer,
  getExpiry
}, name, {
  wrappedOwner,
  fuseOptions,
  expiry,
  resolverAddress
}) {
  const address = await signer.getAddress();
  let decodedFuses;
  const publicResolver = await contracts?.getPublicResolver();
  if (!resolverAddress)
    resolverAddress = publicResolver.address;
  const labels = name.split(".");
  if (labels.length === 2 && labels[1] === "eth") {
    switch (typeof fuseOptions) {
      case "object": {
        decodedFuses = generateFuseInput(fuseOptions);
        break;
      }
      case "number": {
        decodedFuses = fuseOptions.toString(16);
        break;
      }
      case "string": {
        decodedFuses = fuseOptions;
        break;
      }
      case "undefined": {
        decodedFuses = "0";
        break;
      }
      default: {
        throw new Error(`Invalid fuseOptions type: ${typeof fuseOptions}`);
      }
    }
    const expiryToUse = await makeExpiry({ getExpiry }, name, expiry);
    return wrapETH(
      { contracts },
      labels,
      wrappedOwner,
      expiryToUse,
      decodedFuses,
      resolverAddress,
      signer,
      address
    );
  }
  if (fuseOptions)
    throw new Error(
      "Fuses can not be initially set when wrapping a non .eth name"
    );
  if (expiry)
    throw new Error(
      "Expiry can not be initially set when wrapping a non .eth name"
    );
  return wrapOther(
    { contracts },
    name,
    wrappedOwner,
    resolverAddress,
    address,
    signer
  );
}
export {
  wrapName_default as default
};
