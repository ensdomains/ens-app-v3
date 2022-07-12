"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function default_1({ transferSubname }, name, { contract, }) {
    return transferSubname(name, {
        contract,
        address: '0x0000000000000000000000000000000000000000',
    });
}
exports.default = default_1;
