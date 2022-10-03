"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const func = async function (hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const registry = await hardhat_1.ethers.getContract('ENSRegistry');
    const dnssec = await hardhat_1.ethers.getContract('DNSSECImpl');
    const publicSuffixList = await deploy('TLDPublicSuffixList', {
        from: deployer,
        args: [],
        log: true,
    });
    await deploy('DNSRegistrar', {
        from: deployer,
        args: [dnssec.address, publicSuffixList.address, registry.address],
        log: true,
    });
};
func.tags = ['dnsregistrar'];
func.dependencies = ['registry', 'dnssec-oracle'];
exports.default = func;
