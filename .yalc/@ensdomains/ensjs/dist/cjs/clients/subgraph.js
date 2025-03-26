"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnsSubgraphClient = void 0;
const viem_1 = require("viem");
const addEnsContracts_js_1 = require("../contracts/addEnsContracts.js");
const subgraph_js_1 = require("./decorators/subgraph.js");
const createEnsSubgraphClient = ({ batch, chain, key = 'ensSubgraph', name = 'ENS Subgraph Client', transport, pollingInterval, }) => {
    return (0, viem_1.createClient)({
        batch,
        chain: (0, addEnsContracts_js_1.addEnsContracts)(chain),
        key,
        name,
        pollingInterval,
        transport,
        type: 'ensSubgraphClient',
    }).extend(subgraph_js_1.ensSubgraphActions);
};
exports.createEnsSubgraphClient = createEnsSubgraphClient;
//# sourceMappingURL=subgraph.js.map