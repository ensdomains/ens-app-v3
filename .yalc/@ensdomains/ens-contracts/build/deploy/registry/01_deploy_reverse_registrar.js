"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("ethers/lib/utils");
const hardhat_1 = require("hardhat");
const js_sha3_1 = require("js-sha3");
const func = async function (hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, fetchIfDifferent } = deployments;
    const { deployer, owner } = await getNamedAccounts();
    const registry = await hardhat_1.ethers.getContract('ENSRegistry');
    const deployArgs = {
        from: deployer,
        args: [registry.address],
        log: true,
    };
    const { differences } = await fetchIfDifferent('ReverseRegistrar', deployArgs);
    if (!differences)
        return;
    const reverseRegistrar = await deploy('ReverseRegistrar', deployArgs);
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
func.tags = ['registry', 'ReverseRegistrar'];
func.dependencies = ['root'];
exports.default = func;
