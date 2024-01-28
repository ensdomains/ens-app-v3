"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensPublicActions = void 0;
const batch_js_1 = require("../../functions/public/batch.js");
const getAbiRecord_js_1 = require("../../functions/public/getAbiRecord.js");
const getAddressRecord_js_1 = require("../../functions/public/getAddressRecord.js");
const getAvailable_js_1 = require("../../functions/public/getAvailable.js");
const getContentHashRecord_js_1 = require("../../functions/public/getContentHashRecord.js");
const getExpiry_js_1 = require("../../functions/public/getExpiry.js");
const getName_js_1 = require("../../functions/public/getName.js");
const getOwner_js_1 = require("../../functions/public/getOwner.js");
const getPrice_js_1 = require("../../functions/public/getPrice.js");
const getRecords_js_1 = require("../../functions/public/getRecords.js");
const getResolver_js_1 = require("../../functions/public/getResolver.js");
const getTextRecord_js_1 = require("../../functions/public/getTextRecord.js");
const getWrapperData_js_1 = require("../../functions/public/getWrapperData.js");
const getWrapperName_js_1 = require("../../functions/public/getWrapperName.js");
const ensPublicActions = (client) => ({
    ensBatch: (...parameters) => (0, batch_js_1.default)(client, ...parameters),
    getAbiRecord: (parameters) => (0, getAbiRecord_js_1.default)(client, parameters),
    getAddressRecord: (parameters) => (0, getAddressRecord_js_1.default)(client, parameters),
    getAvailable: (parameters) => (0, getAvailable_js_1.default)(client, parameters),
    getContentHashRecord: (parameters) => (0, getContentHashRecord_js_1.default)(client, parameters),
    getExpiry: (parameters) => (0, getExpiry_js_1.default)(client, parameters),
    getName: (parameters) => (0, getName_js_1.default)(client, parameters),
    getOwner: (parameters) => (0, getOwner_js_1.default)(client, parameters),
    getPrice: (parameters) => (0, getPrice_js_1.default)(client, parameters),
    getRecords: (parameters) => (0, getRecords_js_1.default)(client, parameters),
    getResolver: (parameters) => (0, getResolver_js_1.default)(client, parameters),
    getTextRecord: (parameters) => (0, getTextRecord_js_1.default)(client, parameters),
    getWrapperData: (parameters) => (0, getWrapperData_js_1.default)(client, parameters),
    getWrapperName: (parameters) => (0, getWrapperName_js_1.default)(client, parameters),
});
exports.ensPublicActions = ensPublicActions;
//# sourceMappingURL=public.js.map