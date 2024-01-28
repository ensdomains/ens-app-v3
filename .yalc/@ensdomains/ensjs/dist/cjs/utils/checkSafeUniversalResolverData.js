"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSafeUniversalResolverData = void 0;
const viem_1 = require("viem");
const getRevertErrorData_js_1 = require("./getRevertErrorData.js");
const checkSafeUniversalResolverData = (data, { strict, abi, args, functionName, address, docsPath, sender, }) => {
    if (typeof data === 'object') {
        if (!strict) {
            const errorData = (0, getRevertErrorData_js_1.getRevertErrorData)(data);
            if (errorData) {
                try {
                    (0, viem_1.decodeErrorResult)({
                        abi,
                        data: errorData,
                    });
                    return false;
                }
                catch (error) { }
            }
        }
        if (data instanceof viem_1.CallExecutionError)
            throw data;
        throw (0, viem_1.getContractError)(data, {
            abi,
            args: typeof args === 'function' ? args() : args,
            functionName,
            address,
            docsPath,
            sender,
        });
    }
    return true;
};
exports.checkSafeUniversalResolverData = checkSafeUniversalResolverData;
//# sourceMappingURL=checkSafeUniversalResolverData.js.map