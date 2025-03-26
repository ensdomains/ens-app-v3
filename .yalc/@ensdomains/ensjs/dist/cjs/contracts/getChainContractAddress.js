"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChainContractAddress = void 0;
const utils_1 = require("viem/utils");
const getChainContractAddress = ({ blockNumber, client, contract, }) => (0, utils_1.getChainContractAddress)({
    blockNumber,
    chain: client.chain,
    contract: contract,
});
exports.getChainContractAddress = getChainContractAddress;
//# sourceMappingURL=getChainContractAddress.js.map