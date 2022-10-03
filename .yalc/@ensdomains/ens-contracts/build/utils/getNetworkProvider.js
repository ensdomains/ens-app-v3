"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
exports.default = async (network) => {
    try {
        const provider = await hardhat_1.ethers.getDefaultProvider(network.name);
        return provider;
    }
    catch (_a) {
        const registry = await hardhat_1.ethers.getContract('ENSRegistry');
        return new hardhat_1.ethers.providers.Web3Provider(network.provider, {
            name: network.name,
            chainId: network.config.chainId,
            ensAddress: registry.address
        });
    }
};
