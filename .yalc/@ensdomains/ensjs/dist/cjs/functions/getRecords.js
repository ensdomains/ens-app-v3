"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../utils/validation");
async function default_1({ getProfile }, name, options) {
    const inputType = (0, validation_1.parseInputType)(name);
    if (inputType.type !== 'name' && inputType.type !== 'label') {
        throw new Error('Input must be an ENS name');
    }
    return await getProfile(name, options);
}
exports.default = default_1;
