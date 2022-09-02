"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function default_1({ transferSubname, signer }, name, { contract, }) {
    return transferSubname.populateTransaction(name, {
        contract,
        owner: '0x0000000000000000000000000000000000000000',
        signer,
    });
}
exports.default = default_1;
