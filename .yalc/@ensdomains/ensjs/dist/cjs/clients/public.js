"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnsPublicClient = void 0;
const viem_1 = require("viem");
const addEnsContracts_js_1 = require("../contracts/addEnsContracts.js");
const public_js_1 = require("./decorators/public.js");
const subgraph_js_1 = require("./decorators/subgraph.js");
const createEnsPublicClient = ({ batch, chain, key = 'ensPublic', name = 'ENS Public Client', transport, pollingInterval, }) => {
    return (0, viem_1.createClient)({
        batch,
        chain: (0, addEnsContracts_js_1.addEnsContracts)(chain),
        key,
        name,
        pollingInterval,
        transport,
        type: 'ensPublicClient',
    })
        .extend(public_js_1.ensPublicActions)
        .extend(subgraph_js_1.ensSubgraphActions);
};
exports.createEnsPublicClient = createEnsPublicClient;
//# sourceMappingURL=public.js.map