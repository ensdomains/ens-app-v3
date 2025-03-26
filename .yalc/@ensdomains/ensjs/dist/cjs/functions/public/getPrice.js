"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const bulkRenewal_js_1 = require("../../contracts/bulkRenewal.js");
const ethRegistrarController_js_1 = require("../../contracts/ethRegistrarController.js");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const general_js_1 = require("../../errors/general.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
const multicallWrapper_js_1 = require("./multicallWrapper.js");
const encode = (client, { nameOrNames, duration }) => {
    const names = (Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]).map((name) => {
        const labels = name.split('.');
        const nameType = (0, getNameType_js_1.getNameType)(name);
        if (nameType !== 'eth-2ld' && nameType !== 'tld')
            throw new general_js_1.UnsupportedNameTypeError({
                nameType,
                supportedNameTypes: ['eth-2ld', 'tld'],
                details: 'Currently only the price of eth-2ld names can be fetched',
            });
        return labels[0];
    });
    if (names.length > 1) {
        const bulkRenewalAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
            client,
            contract: 'ensBulkRenewal',
        });
        return multicallWrapper_js_1.default.encode(client, {
            transactions: [
                {
                    to: bulkRenewalAddress,
                    data: (0, viem_1.encodeFunctionData)({
                        abi: bulkRenewal_js_1.bulkRenewalRentPriceSnippet,
                        functionName: 'rentPrice',
                        args: [names, BigInt(duration)],
                    }),
                },
                {
                    to: bulkRenewalAddress,
                    data: (0, viem_1.encodeFunctionData)({
                        abi: bulkRenewal_js_1.bulkRenewalRentPriceSnippet,
                        functionName: 'rentPrice',
                        args: [names, 0n],
                    }),
                },
            ],
        });
    }
    return {
        to: (0, getChainContractAddress_js_1.getChainContractAddress)({
            client,
            contract: 'ensEthRegistrarController',
        }),
        data: (0, viem_1.encodeFunctionData)({
            abi: ethRegistrarController_js_1.ethRegistrarControllerRentPriceSnippet,
            functionName: 'rentPrice',
            args: [names[0], BigInt(duration)],
        }),
    };
};
const decode = async (client, data, { nameOrNames }) => {
    if (typeof data === 'object')
        throw data;
    const isBulkRenewal = Array.isArray(nameOrNames) && nameOrNames.length > 1;
    if (isBulkRenewal) {
        const result = await multicallWrapper_js_1.default.decode(client, data, []);
        const price = (0, viem_1.decodeFunctionResult)({
            abi: bulkRenewal_js_1.bulkRenewalRentPriceSnippet,
            functionName: 'rentPrice',
            data: result[0].returnData,
        });
        const premium = (0, viem_1.decodeFunctionResult)({
            abi: bulkRenewal_js_1.bulkRenewalRentPriceSnippet,
            functionName: 'rentPrice',
            data: result[1].returnData,
        });
        const base = price - premium;
        return { base, premium };
    }
    return (0, viem_1.decodeFunctionResult)({
        abi: ethRegistrarController_js_1.ethRegistrarControllerRentPriceSnippet,
        functionName: 'rentPrice',
        data,
    });
};
const getPrice = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = getPrice;
//# sourceMappingURL=getPrice.js.map