"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEnsContracts = void 0;
const contracts_js_1 = require("../errors/contracts.js");
const consts_js_1 = require("./consts.js");
const addEnsContracts = (chain) => {
    if (!chain)
        throw new contracts_js_1.NoChainError();
    if (!consts_js_1.supportedChains.includes(chain.id))
        throw new contracts_js_1.UnsupportedChainError({
            chainId: chain.id,
            supportedChains: consts_js_1.supportedChains,
        });
    return {
        ...chain,
        contracts: {
            ...chain.contracts,
            ...consts_js_1.addresses[chain.id],
        },
        subgraphs: {
            ...consts_js_1.subgraphs[chain.id],
        },
    };
};
exports.addEnsContracts = addEnsContracts;
//# sourceMappingURL=addEnsContracts.js.map