"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const nameWrapper_js_1 = require("../../contracts/nameWrapper.js");
const consts_js_1 = require("../../utils/consts.js");
const fuses_js_1 = require("../../utils/fuses.js");
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const makeSafeSecondsDate_js_1 = require("../../utils/makeSafeSecondsDate.js");
const normalise_js_1 = require("../../utils/normalise.js");
const encode = (client, { name }) => {
    const address = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client,
        contract: 'ensNameWrapper',
    });
    const args = [BigInt((0, normalise_js_1.namehash)(name))];
    return {
        to: address,
        data: (0, viem_1.encodeFunctionData)({
            abi: nameWrapper_js_1.nameWrapperGetDataSnippet,
            functionName: 'getData',
            args,
        }),
        passthrough: { address, args },
    };
};
const decode = async (_client, data, passthrough) => {
    if (typeof data === 'object')
        throw (0, viem_1.getContractError)(data, {
            abi: nameWrapper_js_1.nameWrapperGetDataSnippet,
            functionName: 'getData',
            args: passthrough.args,
            address: passthrough.address,
        });
    const [owner, fuses, expiry] = (0, viem_1.decodeFunctionResult)({
        abi: nameWrapper_js_1.nameWrapperGetDataSnippet,
        functionName: 'getData',
        data,
    });
    if (owner === consts_js_1.EMPTY_ADDRESS) {
        return null;
    }
    const fuseObj = (0, fuses_js_1.decodeFuses)(fuses);
    const expiryDate = expiry > 0 ? (0, makeSafeSecondsDate_js_1.makeSafeSecondsDate)(expiry) : null;
    return {
        fuses: {
            ...fuseObj,
            value: fuses,
        },
        expiry: expiryDate
            ? {
                date: expiryDate,
                value: expiry,
            }
            : null,
        owner,
    };
};
const getWrapperData = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = getWrapperData;
//# sourceMappingURL=getWrapperData.js.map