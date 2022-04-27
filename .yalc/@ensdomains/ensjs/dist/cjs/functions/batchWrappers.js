"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multicallWrapper = exports.resolverMulticallWrapper = exports.universalWrapper = void 0;
const hexEncodedName_1 = require("../utils/hexEncodedName");
exports.universalWrapper = {
    raw: async ({ contracts }, name, data) => {
        const universalResolver = await contracts?.getUniversalResolver();
        return {
            to: universalResolver.address,
            data: universalResolver.interface.encodeFunctionData('resolve', [
                (0, hexEncodedName_1.hexEncodeName)(name),
                data,
            ]),
        };
    },
    decode: async ({ contracts }, data) => {
        const universalResolver = await contracts?.getUniversalResolver();
        const response = universalResolver.interface.decodeFunctionResult('resolve', data);
        if (!response || !response[0]) {
            return null;
        }
        return { data: response[0], resolver: response[1] };
    },
};
exports.resolverMulticallWrapper = {
    raw: async ({ contracts }, data) => {
        const publicResolver = await contracts?.getPublicResolver();
        const formattedDataArr = data.map((item) => item.data);
        return {
            to: publicResolver.address,
            data: publicResolver.interface.encodeFunctionData('multicall', [
                formattedDataArr,
            ]),
        };
    },
    decode: async ({ contracts }, data) => {
        const publicResolver = await contracts?.getPublicResolver();
        const response = publicResolver.interface.decodeFunctionResult('multicall', data);
        if (!response) {
            return null;
        }
        return response;
    },
};
exports.multicallWrapper = {
    raw: async function ({ contracts }, transactions, requireSuccess = false) {
        const multicall = await contracts?.getMulticall();
        return {
            to: multicall.address,
            data: multicall.interface.encodeFunctionData('tryAggregate', [
                requireSuccess,
                transactions.map((tx) => ({
                    target: tx.to,
                    callData: tx.data,
                })),
            ]),
        };
    },
    decode: async function ({ contracts }, data) {
        if (!data)
            return null;
        const multicall = await contracts?.getMulticall();
        try {
            const [result] = multicall.interface.decodeFunctionResult('tryAggregate', data);
            return result;
        }
        catch {
            return null;
        }
    },
};
