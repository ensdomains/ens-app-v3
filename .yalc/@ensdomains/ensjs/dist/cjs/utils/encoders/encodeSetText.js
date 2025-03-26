"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSetText = void 0;
const viem_1 = require("viem");
const publicResolver_js_1 = require("../../contracts/publicResolver.js");
const encodeSetText = ({ namehash, key, value, }) => {
    return (0, viem_1.encodeFunctionData)({
        abi: publicResolver_js_1.publicResolverSetTextSnippet,
        functionName: 'setText',
        args: [namehash, key, value ?? ''],
    });
};
exports.encodeSetText = encodeSetText;
//# sourceMappingURL=encodeSetText.js.map