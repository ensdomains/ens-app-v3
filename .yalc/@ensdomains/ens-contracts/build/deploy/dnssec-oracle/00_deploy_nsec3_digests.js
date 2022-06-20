"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async function (hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    await deploy('SHA1NSEC3Digest', {
        from: deployer,
        args: [],
        log: true,
    });
};
func.tags = ['dnssec-nsec3-digests'];
func.dependencies = ['registry'];
exports.default = func;
