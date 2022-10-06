"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("ethers/lib/utils");
const hardhat_1 = require("hardhat");
const { makeInterfaceId } = require('@openzeppelin/test-helpers');
function computeInterfaceId(iface) {
    return makeInterfaceId.ERC165(Object.values(iface.functions).map((frag) => frag.format('sighash')));
}
const func = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy } = deployments;
    const { deployer, owner } = await getNamedAccounts();
    const registry = await hardhat_1.ethers.getContract('ENSRegistry', owner);
    const registrar = await hardhat_1.ethers.getContract('BaseRegistrarImplementation', owner);
    const metadata = await hardhat_1.ethers.getContract('StaticMetadataService', owner);
    const deployArgs = {
        from: deployer,
        args: [registry.address, registrar.address, metadata.address],
        log: true,
    };
    const nameWrapper = await deploy('NameWrapper', deployArgs);
    if (!nameWrapper.newlyDeployed)
        return;
    if (owner !== deployer) {
        const wrapper = await hardhat_1.ethers.getContract('NameWrapper', deployer);
        const tx = await wrapper.transferOwnership(owner);
        console.log(`Transferring ownership of NameWrapper to ${owner} (tx: ${tx.hash})...`);
        await tx.wait();
    }
    // Only attempt to make controller etc changes directly on testnets
    if (network.name === 'mainnet')
        return;
    const tx2 = await registrar.addController(nameWrapper.address);
    console.log(`Adding NameWrapper as controller on registrar (tx: ${tx2.hash})...`);
    await tx2.wait();
    const artifact = await deployments.getArtifact('NameWrapper');
    const interfaceId = computeInterfaceId(new utils_1.Interface(artifact.abi));
    const providerWithEns = new hardhat_1.ethers.providers.StaticJsonRpcProvider(hardhat_1.ethers.provider.connection.url, { ...hardhat_1.ethers.provider.network, ensAddress: registry.address });
    const resolver = await providerWithEns.getResolver('eth');
    if (resolver === null) {
        console.log('No resolver set for .eth; not setting interface for NameWrapper');
        return;
    }
    const resolverContract = await hardhat_1.ethers.getContractAt('PublicResolver', resolver.address);
    const tx3 = await resolverContract.setInterface(hardhat_1.ethers.utils.namehash('eth'), interfaceId, nameWrapper.address);
    console.log(`Setting NameWrapper interface ID ${interfaceId} on .eth resolver (tx: ${tx3.hash})...`);
    await tx3.wait();
};
func.id = 'name-wrapper';
func.tags = ['wrapper', 'NameWrapper'];
func.dependencies = [
    'BaseRegistrarImplementation',
    'StaticMetadataService',
    'registry',
];
exports.default = func;
