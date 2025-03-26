"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensWalletActions = void 0;
const clearRecords_js_1 = require("../../functions/wallet/clearRecords.js");
const commitName_js_1 = require("../../functions/wallet/commitName.js");
const createSubname_js_1 = require("../../functions/wallet/createSubname.js");
const deleteSubname_js_1 = require("../../functions/wallet/deleteSubname.js");
const registerName_js_1 = require("../../functions/wallet/registerName.js");
const renewNames_js_1 = require("../../functions/wallet/renewNames.js");
const setAbiRecord_js_1 = require("../../functions/wallet/setAbiRecord.js");
const setAddressRecord_js_1 = require("../../functions/wallet/setAddressRecord.js");
const setChildFuses_js_1 = require("../../functions/wallet/setChildFuses.js");
const setContentHashRecord_js_1 = require("../../functions/wallet/setContentHashRecord.js");
const setFuses_js_1 = require("../../functions/wallet/setFuses.js");
const setPrimaryName_js_1 = require("../../functions/wallet/setPrimaryName.js");
const setRecords_js_1 = require("../../functions/wallet/setRecords.js");
const setResolver_js_1 = require("../../functions/wallet/setResolver.js");
const setTextRecord_js_1 = require("../../functions/wallet/setTextRecord.js");
const transferName_js_1 = require("../../functions/wallet/transferName.js");
const unwrapName_js_1 = require("../../functions/wallet/unwrapName.js");
const wrapName_js_1 = require("../../functions/wallet/wrapName.js");
const ensWalletActions = (client) => ({
    clearRecords: (parameters) => (0, clearRecords_js_1.default)(client, parameters),
    commitName: (parameters) => (0, commitName_js_1.default)(client, parameters),
    createSubname: (parameters) => (0, createSubname_js_1.default)(client, parameters),
    deleteSubname: (parameters) => (0, deleteSubname_js_1.default)(client, parameters),
    registerName: (parameters) => (0, registerName_js_1.default)(client, parameters),
    renewNames: (parameters) => (0, renewNames_js_1.default)(client, parameters),
    setAbiRecord: (parameters) => (0, setAbiRecord_js_1.default)(client, parameters),
    setAddressRecord: (parameters) => (0, setAddressRecord_js_1.default)(client, parameters),
    setChildFuses: (parameters) => (0, setChildFuses_js_1.default)(client, parameters),
    setContentHashRecord: (parameters) => (0, setContentHashRecord_js_1.default)(client, parameters),
    setFuses: (parameters) => (0, setFuses_js_1.default)(client, parameters),
    setPrimaryName: (parameters) => (0, setPrimaryName_js_1.default)(client, parameters),
    setRecords: (parameters) => (0, setRecords_js_1.default)(client, parameters),
    setResolver: (parameters) => (0, setResolver_js_1.default)(client, parameters),
    setTextRecord: (parameters) => (0, setTextRecord_js_1.default)(client, parameters),
    transferName: (parameters) => (0, transferName_js_1.default)(client, parameters),
    unwrapName: (parameters) => (0, unwrapName_js_1.default)(client, parameters),
    wrapName: (parameters) => (0, wrapName_js_1.default)(client, parameters),
});
exports.ensWalletActions = ensWalletActions;
//# sourceMappingURL=wallet.js.map