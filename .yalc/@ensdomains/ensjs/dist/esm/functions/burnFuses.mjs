// src/functions/burnFuses.ts
import { validateFuses } from "../utils/fuses.mjs";
import { namehash } from "../utils/normalise.mjs";
async function burnFuses_default({ contracts, signer }, name, props) {
  const encodedFuses = validateFuses(props);
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  const hash = namehash(name);
  return nameWrapper.populateTransaction.setFuses(hash, encodedFuses);
}
export {
  burnFuses_default as default
};
