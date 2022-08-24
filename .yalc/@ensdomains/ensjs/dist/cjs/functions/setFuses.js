"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalise_1 = require("../utils/normalise");
const fuses_1 = __importDefault(require("../utils/fuses"));
async function default_1({ contracts, signer }, name, { selectedFuses }) {
    const fuseNumber = selectedFuses.reduce((previousValue, currentValue) => {
        return previousValue + fuses_1.default[currentValue];
    }, 0);
    const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
    return nameWrapper.populateTransaction.setFuses((0, normalise_1.namehash)(name), fuseNumber);
}
exports.default = default_1;
