"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevertErrorData = void 0;
const viem_1 = require("viem");
const getRevertErrorData = (err) => {
    if (!(err instanceof viem_1.BaseError))
        return undefined;
    const error = err.walk();
    const hex = typeof error.data === 'object' ? error.data.data : error.data;
    if (hex === '0x')
        return undefined;
    return hex;
};
exports.getRevertErrorData = getRevertErrorData;
//# sourceMappingURL=getRevertErrorData.js.map