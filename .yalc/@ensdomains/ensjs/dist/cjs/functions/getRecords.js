"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function default_1({ getProfile }, name, options) {
    if (!name.includes('.')) {
        throw new Error('Input is not an ENS name');
    }
    return await getProfile(name, options);
}
exports.default = default_1;
