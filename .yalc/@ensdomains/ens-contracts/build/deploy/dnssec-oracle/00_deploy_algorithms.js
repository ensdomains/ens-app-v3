"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    await deploy('RSASHA1Algorithm', {
        from: deployer,
        args: [],
        log: true,
    });
    await deploy('RSASHA256Algorithm', {
        from: deployer,
        args: [],
        log: true,
    });
    await deploy('P256SHA256Algorithm', {
        from: deployer,
        args: [],
        log: true,
    });
    if (network.tags.test) {
        await deploy('DummyAlgorithm', {
            from: deployer,
            args: [],
            log: true,
        });
    }
};
func.tags = ['dnssec-algorithms'];
exports.default = func;
