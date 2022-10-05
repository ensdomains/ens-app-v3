// src/utils/makeHashIndexes.ts
import { namehash } from "./normalise.mjs";
var makeOtherIndexes = (data, findStr) => Array.from(data.matchAll(findStr)).map((x) => x.index / 2 - 1);
var makeNamehashIndexes = (data, name) => Array.from(data.matchAll(namehash(name).substring(2))).map(
  (x) => x.index / 2 - 1
);
export {
  makeNamehashIndexes,
  makeOtherIndexes
};
