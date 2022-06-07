import { ethers } from 'ethers';
export const makeOtherIndexes = (data, findStr) => Array.from(data.matchAll(findStr)).map((x) => x.index / 2 - 1);
export const makeNamehashIndexes = (data, name) => Array.from(data.matchAll(ethers.utils.namehash(name).substring(2))).map((x) => x.index / 2 - 1);
