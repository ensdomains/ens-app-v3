// src/functions/setRecords.ts
import { namehash } from "../utils/normalise.mjs";
import { generateRecordCallArray } from "../utils/recordHelpers.mjs";
async function setRecords_default({
  contracts,
  provider,
  getResolver,
  signer
}, name, {
  records,
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
  const calls = generateRecordCallArray(hash, records, resolver);
  return resolver.populateTransaction.multicall(calls);
}
export {
  setRecords_default as default
};
