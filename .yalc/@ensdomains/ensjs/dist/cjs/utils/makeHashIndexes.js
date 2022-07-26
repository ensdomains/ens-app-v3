"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeNamehashIndexes = exports.makeOtherIndexes = void 0;
const normalise_1 = require("./normalise");
const makeOtherIndexes = (data, findStr) => Array.from(data.matchAll(findStr)).map((x) => x.index / 2 - 1);
exports.makeOtherIndexes = makeOtherIndexes;
const makeNamehashIndexes = (data, name) => Array.from(data.matchAll((0, normalise_1.namehash)(name).substring(2))).map((x) => x.index / 2 - 1);
exports.makeNamehashIndexes = makeNamehashIndexes;
