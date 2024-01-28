"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecordCallArray = void 0;
const encodeClearRecords_js_1 = require("./encoders/encodeClearRecords.js");
const encodeSetAbi_js_1 = require("./encoders/encodeSetAbi.js");
const encodeSetAddr_js_1 = require("./encoders/encodeSetAddr.js");
const encodeSetContentHash_js_1 = require("./encoders/encodeSetContentHash.js");
const encodeSetText_js_1 = require("./encoders/encodeSetText.js");
const generateRecordCallArray = ({ namehash, clearRecords, contentHash, texts, coins, abi, }) => {
    const calls = [];
    if (clearRecords) {
        calls.push((0, encodeClearRecords_js_1.encodeClearRecords)(namehash));
    }
    if (contentHash !== undefined) {
        const data = (0, encodeSetContentHash_js_1.encodeSetContentHash)({ namehash, contentHash });
        if (data)
            calls.push(data);
    }
    if (abi !== undefined) {
        const abis = Array.isArray(abi) ? abi : [abi];
        for (const abi_ of abis) {
            const data = (0, encodeSetAbi_js_1.encodeSetAbi)({ namehash, ...abi_ });
            if (data)
                calls.push(data);
        }
    }
    if (texts && texts.length > 0) {
        const data = texts.map((textItem) => (0, encodeSetText_js_1.encodeSetText)({ namehash, ...textItem }));
        if (data)
            calls.push(...data);
    }
    if (coins && coins.length > 0) {
        const data = coins.map((coinItem) => (0, encodeSetAddr_js_1.encodeSetAddr)({ namehash, ...coinItem }));
        if (data)
            calls.push(...data);
    }
    return calls;
};
exports.generateRecordCallArray = generateRecordCallArray;
//# sourceMappingURL=generateRecordCallArray.js.map