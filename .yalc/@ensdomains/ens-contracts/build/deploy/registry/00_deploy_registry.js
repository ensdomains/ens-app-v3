"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';
const func = async function (hre) {
    console.log('starting');
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, run } = deployments;
    const { deployer, owner } = await getNamedAccounts();
    if (network.tags.legacy) {
        const contract = await deploy('LegacyENSRegistry', {
            from: deployer,
            args: [],
            log: true,
            contract: await deployments.getArtifact('ENSRegistry'),
        });
        const legacyRegistry = await hardhat_1.ethers.getContract('LegacyENSRegistry');
        const rootTx = await legacyRegistry
            .connect(await hardhat_1.ethers.getSigner(deployer))
            .setOwner(ZERO_HASH, owner);
        console.log(`Setting owner of root node to owner (tx: ${rootTx.hash})`);
        await rootTx.wait();
        console.log('Running legacy registry scripts...');
        await run('legacy-registry-names', {
            deletePreviousDeployments: false,
            resetMemory: false,
        });
        const revertRootTx = await legacyRegistry
            .connect(await hardhat_1.ethers.getSigner(owner))
            .setOwner(ZERO_HASH, '0x0000000000000000000000000000000000000000');
        console.log(`Unsetting owner of root node (tx: ${rootTx.hash})`);
        await revertRootTx.wait();
        await deploy('ENSRegistry', {
            from: deployer,
            args: [contract.address],
            log: true,
            contract: await deployments.getArtifact('ENSRegistryWithFallback'),
        });
    }
    else {
        await deploy('ENSRegistry', {
            from: deployer,
            args: [],
            log: true,
        });
    }
    if (!network.tags.use_root) {
        const registry = await hardhat_1.ethers.getContract('ENSRegistry');
        const rootOwner = await registry.owner(ZERO_HASH);
        switch (rootOwner) {
            case deployer:
                const tx = await registry.setOwner(ZERO_HASH, owner, { from: deployer });
                console.log('Setting final owner of root node on registry (tx:${tx.hash})...');
                await tx.wait();
                break;
            case owner:
                break;
            default:
                console.log(`WARNING: ENS registry root is owned by ${rootOwner}; cannot transfer to owner`);
        }
    }
    return true;
};
func.id = 'ens';
func.tags = ['registry', 'ENSRegistry'];
exports.default = func;
