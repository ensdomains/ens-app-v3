"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("ethers/lib/utils");
const hardhat_1 = require("hardhat");
const js_sha3_1 = require("js-sha3");
const func = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy } = deployments;
    const { deployer, owner } = await getNamedAccounts();
    const registry = await hardhat_1.ethers.getContract('ENSRegistry');
    const deployArgs = {
        from: deployer,
        args: [registry.address],
        log: true,
    };
    const reverseRegistrar = await deploy('ReverseRegistrar', deployArgs);
    if (!reverseRegistrar.newlyDeployed)
        return;
    if (owner !== deployer) {
        const r = await hardhat_1.ethers.getContract('ReverseRegistrar', deployer);
        const tx = await r.transferOwnership(owner);
        console.log(`Transferring ownership of ReverseRegistrar to ${owner} (tx: ${tx.hash})...`);
        await tx.wait();
    }
    // Only attempt to make controller etc changes directly on testnets
    if (network.name === 'mainnet')
        return;
    const root = await hardhat_1.ethers.getContract('Root');
    const tx1 = await root
        .connect(await hardhat_1.ethers.getSigner(owner))
        .setSubnodeOwner('0x' + (0, js_sha3_1.keccak256)('reverse'), owner);
    console.log(`Setting owner of .reverse to owner on root (tx: ${tx1.hash})...`);
    await tx1.wait();
    const tx2 = await registry
        .connect(await hardhat_1.ethers.getSigner(owner))
        .setSubnodeOwner((0, utils_1.namehash)('reverse'), '0x' + (0, js_sha3_1.keccak256)('addr'), reverseRegistrar.address);
    console.log(`Setting owner of .addr.reverse to ReverseRegistrar on registry (tx: ${tx2.hash})...`);
    await tx2.wait();
};
func.id = 'reverse-registrar';
func.tags = ['ReverseRegistrar'];
func.dependencies = ['root'];
exports.default = func;
