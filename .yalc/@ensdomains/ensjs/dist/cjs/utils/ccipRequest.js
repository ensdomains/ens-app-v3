"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ccipRequest = void 0;
const viem_1 = require("viem");
const getChainContractAddress_js_1 = require("../contracts/getChainContractAddress.js");
const ccipBatchRequest_js_1 = require("./ccipBatchRequest.js");
const abi = (0, viem_1.parseAbi)([
    'function query((address,string[],bytes)[]) returns (bool[],bytes[])',
]);
const universalResolverQuerySig = '0xa780bab6';
const ccipRequest = (chain) => async ({ data, sender, urls, }) => {
    const universalResolverAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client: { chain },
        contract: 'ensUniversalResolver',
    });
    const isUniversalResolverRequest = (0, viem_1.isAddressEqual)(sender, universalResolverAddress);
    if (isUniversalResolverRequest &&
        data.slice(0, 10) === universalResolverQuerySig) {
        const { args } = (0, viem_1.decodeFunctionData)({ abi, data });
        const result = await (0, ccipBatchRequest_js_1.ccipBatchRequest)(args[0]);
        return (0, viem_1.encodeFunctionResult)({ abi, result });
    }
    return (0, viem_1.ccipRequest)({ data, sender, urls });
};
exports.ccipRequest = ccipRequest;
//# sourceMappingURL=ccipRequest.js.map