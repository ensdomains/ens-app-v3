"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensSubgraphActions = void 0;
const getDecodedName_js_1 = require("../../functions/subgraph/getDecodedName.js");
const getNameHistory_js_1 = require("../../functions/subgraph/getNameHistory.js");
const getNamesForAddress_js_1 = require("../../functions/subgraph/getNamesForAddress.js");
const getSubgraphRecords_js_1 = require("../../functions/subgraph/getSubgraphRecords.js");
const getSubgraphRegistrant_js_1 = require("../../functions/subgraph/getSubgraphRegistrant.js");
const getSubnames_js_1 = require("../../functions/subgraph/getSubnames.js");
const ensSubgraphActions = (client) => ({
    getDecodedName: (parameters) => (0, getDecodedName_js_1.default)(client, parameters),
    getNameHistory: (parameters) => (0, getNameHistory_js_1.default)(client, parameters),
    getNamesForAddress: (parameters) => (0, getNamesForAddress_js_1.default)(client, parameters),
    getSubgraphRecords: (parameters) => (0, getSubgraphRecords_js_1.default)(client, parameters),
    getSubgraphRegistrant: (parameters) => (0, getSubgraphRegistrant_js_1.default)(client, parameters),
    getSubnames: (parameters) => (0, getSubnames_js_1.default)(client, parameters),
});
exports.ensSubgraphActions = ensSubgraphActions;
//# sourceMappingURL=subgraph.js.map