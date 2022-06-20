"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const func = async function (hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const registry = await hardhat_1.ethers.getContract('ENSRegistry');
    const registrar = await hardhat_1.ethers.getContract('BaseRegistrarImplementation');
    const metadata = await hardhat_1.ethers.getContract('StaticMetadataService');
    const nameWrapper = await deploy('NameWrapper', {
        from: deployer,
        args: [registry.address, registrar.address, metadata.address],
        log: true,
    });
    const tx = await registrar.addController(nameWrapper.address, {
        from: deployer,
    });
    console.log(`Adding NameWrapper as controller on registrar (tx: ${tx.hash})...`);
    await tx.wait();
};
func.id = 'name-wrapper';
func.tags = ['wrapper', 'NameWrapper'];
func.dependencies = ['BaseRegistrarImplementation', 'registry'];
exports.default = func;
