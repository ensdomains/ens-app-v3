"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    let metadataHost = process.env.METADATA_HOST || 'ens-metadata-service.appspot.com';
    if (network.name === 'localhost') {
        metadataHost = 'http://localhost:8080';
    }
    const metadataUrl = `${metadataHost}/name/0x{id}`;
    await deploy('StaticMetadataService', {
        from: deployer,
        args: [metadataUrl],
        log: true,
    });
};
func.id = 'metadata';
func.tags = ['wrapper', 'StaticMetadataService'];
func.dependencies = [];
exports.default = func;
