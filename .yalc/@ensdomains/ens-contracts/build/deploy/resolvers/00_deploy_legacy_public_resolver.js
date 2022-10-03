"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const func = async function (hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const registry = await hardhat_1.ethers.getContract('ENSRegistry');
    if (!hardhat_1.network.tags.legacy) {
        return;
    }
    await deploy('LegacyPublicResolver', {
        from: deployer,
        args: [registry.address],
        log: true,
        contract: await deployments.getArtifact('PublicResolver_mainnet_9412610'),
    });
    return true;
};
func.id = 'legacy-resolver';
func.tags = ['resolvers', 'LegacyPublicResolver'];
func.dependencies = ['registry', 'wrapper'];
exports.default = func;
