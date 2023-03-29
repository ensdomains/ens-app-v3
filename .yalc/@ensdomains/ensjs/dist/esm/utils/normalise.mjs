// src/utils/normalise.ts
import {
  ens_beautify,
  ens_emoji,
  ens_normalize,
  ens_normalize_fragment,
  ens_split,
  ens_tokenize,
  is_combining_mark,
  should_escape
} from "@adraffy/ens-normalize";
import { concat, hexlify } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { decodeLabelhash, isEncodedLabelhash } from "./labels.mjs";
var zeros = new Uint8Array(32);
zeros.fill(0);
var normalise = (name) => name ? ens_normalize(name) : name;
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
var beautify = ens_beautify;
var emoji = ens_emoji;
var normalizeFragment = ens_normalize_fragment;
var split = ens_split;
var tokenise = ens_tokenize;
var isCombiningMark = is_combining_mark;
var shouldEscape = should_escape;
export {
  beautify,
  emoji,
  isCombiningMark,
  namehash,
  normalise,
  normalizeFragment,
  shouldEscape,
  split,
  tokenise
};
