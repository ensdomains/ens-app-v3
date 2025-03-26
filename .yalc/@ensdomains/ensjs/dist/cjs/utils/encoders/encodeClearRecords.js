"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeClearRecords = void 0;
const viem_1 = require("viem");
const publicResolver_js_1 = require("../../contracts/publicResolver.js");
const encodeClearRecords = (namehash) => (0, viem_1.encodeFunctionData)({
    abi: publicResolver_js_1.publicResolverClearRecordsSnippet,
    functionName: 'clearRecords',
    args: [namehash],
});
exports.encodeClearRecords = encodeClearRecords;
//# sourceMappingURL=encodeClearRecords.js.map