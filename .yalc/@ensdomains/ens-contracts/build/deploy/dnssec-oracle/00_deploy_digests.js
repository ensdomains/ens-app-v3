"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    await deploy('SHA1Digest', {
        from: deployer,
        args: [],
        log: true,
    });
    await deploy('SHA256Digest', {
        from: deployer,
        args: [],
        log: true,
    });
    if (network.tags.test) {
        await deploy('DummyDigest', {
            from: deployer,
            args: [],
            log: true,
        });
    }
};
func.tags = ['dnssec-digests'];
exports.default = func;
