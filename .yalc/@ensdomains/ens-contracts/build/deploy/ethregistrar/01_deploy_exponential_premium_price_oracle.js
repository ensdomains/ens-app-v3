"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async function (hre) {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    if (network.name === 'mainnet') {
        return true;
    }
    const dummyOracle = await deploy('DummyOracle', {
        from: deployer,
        args: ['160000000000'],
        log: true,
    });
    await deploy('ExponentialPremiumPriceOracle', {
        from: deployer,
        args: [
            dummyOracle.address,
            [0, 0, '20294266869609', '5073566717402', '158548959919'],
            '100000000000000000000000000',
            21,
        ],
        log: true,
    });
};
func.id = 'price-oracle';
func.tags = ['ethregistrar', 'ExponentialPremiumPriceOracle', 'DummyOracle'];
func.dependencies = ['registry'];
exports.default = func;
