"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecordCallArray = exports.generateSingleRecordCall = exports.generateSetAddr = void 0;
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
function generateSingleRecordCall(namehash, resolver, type) {
    if (type === 'contentHash') {
        return (_r) => {
            const record = _r;
            let _contentHash = '';
            if (record !== _contentHash) {
                const encoded = (0, contentHash_1.encodeContenthash)(record);
                if (encoded.error)
                    throw new Error(encoded.error);
                _contentHash = encoded.encoded;
            }
            return resolver.interface.encodeFunctionData('setContenthash', [
                namehash,
                _contentHash,
            ]);
        };
    }
    else {
        return (_r) => {
            const record = _r;
            if (type === 'text') {
                return resolver.interface.encodeFunctionData('setText', [
                    namehash,
                    record.key,
                    record.value,
                ]);
            }
            else {
                return (0, exports.generateSetAddr)(namehash, record.key, record.value, resolver);
            }
        };
    }
}
exports.generateSingleRecordCall = generateSingleRecordCall;
const generateRecordCallArray = (namehash, records, resolver) => {
    const calls = [];
    if (records.contentHash) {
        const data = generateSingleRecordCall(namehash, resolver, 'contentHash')(records.contentHash);
        data && calls.push(data);
    }
    if (records.texts && records.texts.length > 0) {
        records.texts
            .map(generateSingleRecordCall(namehash, resolver, 'text'))
            .forEach((call) => calls.push(call));
    }
    if (records.coinTypes && records.coinTypes.length > 0) {
        records.coinTypes
            .map(generateSingleRecordCall(namehash, resolver, 'addr'))
            .forEach((call) => calls.push(call));
    }
    return calls;
};
exports.generateRecordCallArray = generateRecordCallArray;
