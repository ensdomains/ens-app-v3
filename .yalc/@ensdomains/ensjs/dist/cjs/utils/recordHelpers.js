"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecordCallArray = exports.generateSetAddr = void 0;
const address_encoder_1 = require("@ensdomains/address-encoder");
const contentHash_1 = require("./contentHash");
const generateSetAddr = (namehash, coinType, address, resolver) => {
    let coinTypeInstance;
    if (!isNaN(parseInt(coinType))) {
        coinTypeInstance = address_encoder_1.formatsByCoinType[parseInt(coinType)];
    }
    else {
        coinTypeInstance = address_encoder_1.formatsByName[coinType.toUpperCase()];
    }
    const inputCoinType = coinTypeInstance.coinType;
    const encodedAddress = coinTypeInstance.decoder(address);
    return resolver?.interface.encodeFunctionData('setAddr(bytes32,uint256,bytes)', [namehash, inputCoinType, encodedAddress]);
};
exports.generateSetAddr = generateSetAddr;
const generateRecordCallArray = (namehash, records, resolver) => {
    const calls = [];
    if (records.contentHash) {
        const contentHash = records.contentHash === '' ? '' : (0, contentHash_1.encodeContenthash)(records.contentHash);
        const data = resolver?.interface.encodeFunctionData('setContenthash', [namehash, contentHash]);
        data && calls.push(data);
    }
    if (records.texts && records.texts.length > 0) {
        records.texts.forEach(({ key, value }) => {
            const data = resolver?.interface.encodeFunctionData('setText', [
                namehash,
                key,
                value,
            ]);
            data && calls.push(data);
        });
    }
    if (records.coinTypes && records.coinTypes.length > 0) {
        records.coinTypes.forEach(({ key, value }) => {
            const data = (0, exports.generateSetAddr)(namehash, key, value, resolver);
            data && calls.push(data);
        });
    }
    return calls;
};
exports.generateRecordCallArray = generateRecordCallArray;
