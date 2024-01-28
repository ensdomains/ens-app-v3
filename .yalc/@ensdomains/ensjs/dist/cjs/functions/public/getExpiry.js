"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const baseRegistrar_js_1 = require("../../contracts/baseRegistrar.js");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const multicall_js_1 = require("../../contracts/multicall.js");
const nameWrapper_js_1 = require("../../contracts/nameWrapper.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const makeSafeSecondsDate_js_1 = require("../../utils/makeSafeSecondsDate.js");
const normalise_js_1 = require("../../utils/normalise.js");
const validation_js_1 = require("../../utils/validation.js");
const multicallWrapper_js_1 = require("./multicallWrapper.js");
const getContractToUse = (contract, labels) => {
    if (contract)
        return contract;
    if ((0, validation_js_1.checkIsDotEth)(labels)) {
        return 'registrar';
    }
    return 'nameWrapper';
};
const encode = (client, { name, contract }) => {
    const labels = name.split('.');
    const contractToUse = getContractToUse(contract, labels);
    const calls = [
        {
            to: (0, getChainContractAddress_js_1.getChainContractAddress)({ client, contract: 'multicall3' }),
            data: (0, viem_1.encodeFunctionData)({
                abi: multicall_js_1.multicallGetCurrentBlockTimestampSnippet,
                functionName: 'getCurrentBlockTimestamp',
            }),
        },
    ];
    if (contractToUse === 'nameWrapper') {
        calls.push({
            to: (0, getChainContractAddress_js_1.getChainContractAddress)({ client, contract: 'ensNameWrapper' }),
            data: (0, viem_1.encodeFunctionData)({
                abi: nameWrapper_js_1.nameWrapperGetDataSnippet,
                functionName: 'getData',
                args: [BigInt((0, normalise_js_1.namehash)(labels.join('.')))],
            }),
        });
    }
    else {
        const baseRegistrarImplementationAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
            client,
            contract: 'ensBaseRegistrarImplementation',
        });
        calls.push({
            to: baseRegistrarImplementationAddress,
            data: (0, viem_1.encodeFunctionData)({
                abi: baseRegistrar_js_1.baseRegistrarNameExpiresSnippet,
                functionName: 'nameExpires',
                args: [BigInt((0, viem_1.labelhash)(labels[0]))],
            }),
        });
        calls.push({
            to: baseRegistrarImplementationAddress,
            data: (0, viem_1.encodeFunctionData)({
                abi: baseRegistrar_js_1.baseRegistrarGracePeriodSnippet,
                functionName: 'GRACE_PERIOD',
            }),
        });
    }
    return multicallWrapper_js_1.default.encode(client, { transactions: calls });
};
const decode = async (client, data, { name, contract }) => {
    if (typeof data === 'object')
        throw data;
    const labels = name.split('.');
    const result = await multicallWrapper_js_1.default.decode(client, data, []);
    const blockTimestamp = (0, viem_1.decodeFunctionResult)({
        abi: multicall_js_1.multicallGetCurrentBlockTimestampSnippet,
        functionName: 'getCurrentBlockTimestamp',
        data: result[0].returnData,
    });
    const contractToUse = getContractToUse(contract, labels);
    let expiry;
    let gracePeriod = 0n;
    if (contractToUse === 'nameWrapper') {
        ;
        [, , expiry] = (0, viem_1.decodeFunctionResult)({
            abi: nameWrapper_js_1.nameWrapperGetDataSnippet,
            functionName: 'getData',
            data: result[1].returnData,
        });
    }
    else {
        expiry = (0, viem_1.decodeFunctionResult)({
            abi: baseRegistrar_js_1.baseRegistrarNameExpiresSnippet,
            functionName: 'nameExpires',
            data: result[1].returnData,
        });
        gracePeriod = (0, viem_1.decodeFunctionResult)({
            abi: baseRegistrar_js_1.baseRegistrarGracePeriodSnippet,
            functionName: 'GRACE_PERIOD',
            data: result[2].returnData,
        });
    }
    if (expiry === 0n) {
        return null;
    }
    let status = 'active';
    if (blockTimestamp > expiry + gracePeriod) {
        status = 'expired';
    }
    else if (blockTimestamp > expiry) {
        status = 'gracePeriod';
    }
    return {
        expiry: {
            date: (0, makeSafeSecondsDate_js_1.makeSafeSecondsDate)(expiry),
            value: expiry,
        },
        gracePeriod: Number(gracePeriod),
        status,
    };
};
const getExpiry = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = getExpiry;
//# sourceMappingURL=getExpiry.js.map