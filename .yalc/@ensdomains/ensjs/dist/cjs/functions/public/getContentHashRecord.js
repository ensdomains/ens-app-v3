"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateFunction_js_1 = require("../../utils/generateFunction.js");
const _getContentHash_js_1 = require("./_getContentHash.js");
const universalWrapper_js_1 = require("./universalWrapper.js");
const encode = (client, { name, gatewayUrls }) => {
    const prData = _getContentHash_js_1.default.encode(client, { name });
    return universalWrapper_js_1.default.encode(client, {
        name,
        data: prData.data,
        gatewayUrls,
    });
};
const decode = async (client, data, passthrough, { strict, gatewayUrls, }) => {
    const urData = await universalWrapper_js_1.default.decode(client, data, passthrough, {
        strict,
        gatewayUrls,
    });
    if (!urData)
        return null;
    return _getContentHash_js_1.default.decode(client, urData.data, { strict });
};
const getContentHashRecord = (0, generateFunction_js_1.generateFunction)({ encode, decode });
exports.default = getContentHashRecord;
//# sourceMappingURL=getContentHashRecord.js.map