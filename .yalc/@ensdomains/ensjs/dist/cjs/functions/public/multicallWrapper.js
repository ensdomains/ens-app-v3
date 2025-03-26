"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const multicall_js_1 = require("../../contracts/multicall.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const encode = (client, { transactions, requireSuccess = false }) => {
    return {
        to: (0, getChainContractAddress_js_1.getChainContractAddress)({ client, contract: 'multicall3' }),
        data: (0, viem_1.encodeFunctionData)({
            abi: multicall_js_1.multicallTryAggregateSnippet,
            functionName: 'tryAggregate',
            args: [
                requireSuccess,
                transactions.map((tx) => ({ target: tx.to, callData: tx.data })),
            ],
        }),
    };
};
const decode = async (client, data, transactions) => {
    if (typeof data === 'object') {
        throw (0, viem_1.getContractError)(data, {
            abi: multicall_js_1.multicallTryAggregateSnippet,
            functionName: 'tryAggregate',
            args: [],
        });
    }
    const result = (0, viem_1.decodeFunctionResult)({
        abi: multicall_js_1.multicallTryAggregateSnippet,
        functionName: 'tryAggregate',
        data,
    });
    const ccipChecked = await Promise.all(result.map(async ({ success, returnData }, i) => {
        let newObj = {
            success,
            returnData,
        };
        if (!success && returnData.startsWith('0x556f1830')) {
            try {
                const newData = await (0, viem_1.offchainLookup)(client, {
                    to: transactions[i].to,
                    data: returnData,
                });
                if (newData) {
                    newObj = { success: true, returnData: newData };
                }
            }
            catch { }
        }
        return newObj;
    }));
    return ccipChecked;
};
const multicallWrapper = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = multicallWrapper;
//# sourceMappingURL=multicallWrapper.js.map