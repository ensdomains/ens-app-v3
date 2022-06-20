"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const func = async function (hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const registry = await hardhat_1.ethers.getContract('ENSRegistry');
    const nameWrapper = await hardhat_1.ethers.getContract('NameWrapper');
    const controller = await hardhat_1.ethers.getContract('ETHRegistrarController');
    const reverseRegistrar = await hardhat_1.ethers.getContract('ReverseRegistrar');
    const publicResolver = await deploy('PublicResolver', {
        from: deployer,
        args: [
            registry.address,
            nameWrapper.address,
            controller.address,
            reverseRegistrar.address,
        ],
        log: true,
    });
    const tx = await reverseRegistrar.setDefaultResolver(publicResolver.address, {
        from: deployer,
    });
    console.log(`Setting default resolver on ReverseRegistrar to resolver (tx: ${tx.hash})...`);
    await tx.wait();
};
func.id = 'resolver';
func.tags = ['resolvers', 'PublicResolver'];
func.dependencies = ['registry', 'ethregistrar', 'wrapper'];
exports.default = func;
