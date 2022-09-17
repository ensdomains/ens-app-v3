// src/utils/normalise.ts
import { concat, hexlify, keccak256, toUtf8Bytes } from "ethers/lib/utils.js";
import uts46 from "idna-uts46-hx/uts46bundle.js";
import { decodeLabelhash, isEncodedLabelhash } from "./labels.mjs";
var zeros = new Uint8Array(32);
zeros.fill(0);
var normalise = (name) => name ? uts46.toUnicode(name, { useStd3ASCII: true }) : name;
var namehash = (name) => {
  let result = zeros;
  if (name) {
    const labels = name.split(".");
    for (let i = labels.length - 1; i >= 0; i -= 1) {
      let labelSha;
      if (isEncodedLabelhash(labels[i])) {
        labelSha = decodeLabelhash(labels[i]);
      } else {
        const normalised = normalise(labels[i]);
        labelSha = keccak256(toUtf8Bytes(normalised));
      }
      result = keccak256(concat([result, labelSha]));
    }
  } else {
    result = hexlify(zeros);
  }
  return result;
};
export {
  namehash,
  normalise
};
