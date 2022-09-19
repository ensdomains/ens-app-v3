"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const func = async function (hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, fetchIfDifferent } = deployments;
    const { deployer } = await getNamedAccounts();
    const registry = await hardhat_1.ethers.getContract('ENSRegistry');
    const nameWrapper = await hardhat_1.ethers.getContract('NameWrapper');
    const controller = await hardhat_1.ethers.getContract('ETHRegistrarController');
    const reverseRegistrar = await hardhat_1.ethers.getContract('ReverseRegistrar');
    const deployArgs = {
        from: deployer,
        args: [
            registry.address,
            nameWrapper.address,
            controller.address,
            reverseRegistrar.address,
        ],
        log: true,
    };
    const { differences } = await fetchIfDifferent('PublicResolver', deployArgs);
    if (!differences)
        return;
    const publicResolver = await deploy('PublicResolver', deployArgs);
    const tx = await reverseRegistrar.setDefaultResolver(publicResolver.address, {
        from: deployer,
    });
    console.log(`Setting default resolver on ReverseRegistrar to PublicResolver (tx: ${tx.hash})...`);
    await tx.wait();
};
func.id = 'resolver';
func.tags = ['resolvers', 'PublicResolver'];
func.dependencies = ['registry', 'ETHRegistrarController', 'NameWrapper', 'ReverseRegistrar'];
exports.default = func;
