"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalise_1 = require("../utils/normalise");
async function default_1({ contracts, signer }, name, { fuses }) {
    const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
    return nameWrapper.populateTransaction.setFuses((0, normalise_1.namehash)(name), fuses);
}
exports.default = default_1;
