"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eth_ens_namehash_1 = __importDefault(require("eth-ens-namehash"));
const hardhat_1 = require("hardhat");
const js_sha3_1 = require("js-sha3");
const func = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, fetchIfDifferent } = deployments;
    const { deployer, owner } = await getNamedAccounts();
    if (!network.tags.use_root) {
        return true;
    }
    const registry = await hardhat_1.ethers.getContract('ENSRegistry');
    const root = await hardhat_1.ethers.getContract('Root');
    const deployArgs = {
        from: deployer,
        args: [registry.address, eth_ens_namehash_1.default.hash('eth')],
        log: true,
    };
    const { differences } = await fetchIfDifferent('BaseRegistrarImplementation', deployArgs);
    if (!differences)
        return;
    await deploy('BaseRegistrarImplementation', deployArgs);
    const registrar = await hardhat_1.ethers.getContract('BaseRegistrarImplementation');
    const tx1 = await registrar.addController(owner, { from: deployer });
    console.log(`Adding owner as controller to registrar (tx: ${tx1.hash})...`);
    await tx1.wait();
    const tx2 = await root
        .connect(await hardhat_1.ethers.getSigner(owner))
        .setSubnodeOwner('0x' + (0, js_sha3_1.keccak256)('eth'), registrar.address);
    console.log(`Setting owner of eth node to registrar on root (tx: ${tx2.hash})...`);
    await tx2.wait();
};
func.id = 'registrar';
func.tags = ['ethregistrar', 'BaseRegistrarImplementation'];
func.dependencies = ['registry', 'root'];
exports.default = func;
