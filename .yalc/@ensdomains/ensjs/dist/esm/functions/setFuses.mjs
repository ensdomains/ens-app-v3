// src/functions/setFuses.ts
import { encodeFuses } from "../utils/fuses.mjs";
import { labelhash } from "../utils/labels.mjs";
import { namehash } from "../utils/normalise.mjs";
async function setChildFuses({ contracts, signer }, name, {
  fuses,
  expiry = 0
}) {
  const encodedFuses = encodeFuses(fuses);
  const labels = name.split(".");
  const labelHash = labelhash(labels.shift());
  const parentNode = namehash(labels.join("."));
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  return nameWrapper.populateTransaction.setChildFuses(
    parentNode,
    labelHash,
    encodedFuses,
    expiry
  );
}
async function setFuses_default({ contracts, signer }, name, props) {
  const encodedFuses = encodeFuses(props, "child");
  const nameWrapper = (await contracts.getNameWrapper()).connect(signer);
  const hash = namehash(name);
  return nameWrapper.populateTransaction.setFuses(hash, encodedFuses);
}
export {
  setFuses_default as default,
  setChildFuses
};
