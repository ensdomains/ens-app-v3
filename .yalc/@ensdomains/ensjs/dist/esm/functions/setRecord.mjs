// src/functions/setRecord.ts
import { namehash } from "../utils/normalise.mjs";
import { generateSingleRecordCall } from "../utils/recordHelpers.mjs";
async function setRecord_default({
  contracts,
  provider,
  getResolver,
  signer
}, name, {
  record,
  type,
  resolverAddress
}) {
  if (!name.includes(".")) {
    throw new Error("Input is not an ENS name");
  }
  let resolverToUse;
  if (resolverAddress) {
    resolverToUse = resolverAddress;
  } else {
    resolverToUse = await getResolver(name);
  }
  if (!resolverToUse) {
    throw new Error("No resolver found for input address");
  }
  const resolver = (await contracts?.getPublicResolver(provider, resolverToUse))?.connect(signer);
  const hash = namehash(name);
  const call = generateSingleRecordCall(hash, resolver, type)(record);
  return {
    to: resolver.address,
    data: call
  };
}
export {
  setRecord_default as default
};
