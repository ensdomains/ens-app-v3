"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeNamehashIndexes = exports.makeOtherIndexes = void 0;
const ethers_1 = require("ethers");
const makeOtherIndexes = (data, findStr) => Array.from(data.matchAll(findStr)).map((x) => x.index / 2 - 1);
exports.makeOtherIndexes = makeOtherIndexes;
const makeNamehashIndexes = (data, name) => Array.from(data.matchAll(ethers_1.ethers.utils.namehash(name).substring(2))).map((x) => x.index / 2 - 1);
exports.makeNamehashIndexes = makeNamehashIndexes;
