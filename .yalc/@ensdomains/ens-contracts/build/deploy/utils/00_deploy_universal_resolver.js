"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const func = async function (hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const registry = await hardhat_1.ethers.getContract('ENSRegistry');
    await deploy('UniversalResolver', {
        from: deployer,
        args: [registry.address],
        log: true,
    });
};
func.id = 'universal-resolver';
func.tags = ['utils', 'UniversalResolver'];
func.dependencies = ['registry'];
exports.default = func;
