"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalise_1 = require("../utils/normalise");
const fuses_1 = require("../utils/fuses");
async function default_1({ contracts, signer }, name, { fusesToBurn, }) {
    const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
    const hash = (0, normalise_1.namehash)(name);
    const encodedFuses = Array.from(fusesToBurn).reduce((previousValue, currentValue) => {
        return previousValue + fuses_1.fuseEnum[currentValue];
    }, 0);
    return nameWrapper.populateTransaction.setFuses(hash, encodedFuses);
}
exports.default = default_1;
