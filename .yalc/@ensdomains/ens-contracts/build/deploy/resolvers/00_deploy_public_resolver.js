"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const func = async function (hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer, owner } = await getNamedAccounts();
    const registry = await hardhat_1.ethers.getContract('ENSRegistry', owner);
    const nameWrapper = await hardhat_1.ethers.getContract('NameWrapper', owner);
    const controller = await hardhat_1.ethers.getContract('ETHRegistrarController', owner);
    const reverseRegistrar = await hardhat_1.ethers.getContract('ReverseRegistrar', owner);
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
    const publicResolver = await deploy('PublicResolver', deployArgs);
    if (!publicResolver.newlyDeployed)
        return;
    const tx = await reverseRegistrar.setDefaultResolver(publicResolver.address);
    console.log(`Setting default resolver on ReverseRegistrar to PublicResolver (tx: ${tx.hash})...`);
    await tx.wait();
    if ((await registry.owner(hardhat_1.ethers.utils.namehash('resolver.eth'))) === owner) {
        const pr = await hardhat_1.ethers.getContract('PublicResolver');
        const resolverHash = hardhat_1.ethers.utils.namehash('resolver.eth');
        const tx2 = await registry.setResolver(resolverHash, pr.address);
        console.log(`Setting resolver for resolver.eth to PublicResolver (tx: ${tx2.hash})...`);
        await tx2.wait();
        const tx3 = await pr['setAddr(bytes32,address)'](resolverHash, pr.address);
        console.log(`Setting address for resolver.eth to PublicResolver (tx: ${tx3.hash})...`);
        await tx3.wait();
    }
    else {
        console.log('resolver.eth is not owned by the owner address, not setting resolver');
    }
};
func.id = 'resolver';
func.tags = ['resolvers', 'PublicResolver'];
func.dependencies = [
    'registry',
    'ETHRegistrarController',
    'NameWrapper',
    'ReverseRegistrar',
];
exports.default = func;
