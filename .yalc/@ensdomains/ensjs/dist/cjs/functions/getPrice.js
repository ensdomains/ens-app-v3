"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const raw = async ({ contracts, multicallWrapper }, nameOrNames, duration, legacy) => {
    const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
    if (names.length > 1) {
        const bulkRenewal = await contracts?.getBulkRenewal();
        return {
            to: bulkRenewal.address,
            data: bulkRenewal.interface.encodeFunctionData('rentPrice', [
                names,
                duration,
            ])
        };
    }
    const controller = await contracts?.getEthRegistrarController();
    const baseCall = {
        to: controller.address,
        data: controller.interface.encodeFunctionData('rentPrice', [
            names[0],
            duration,
        ]),
    };
    if (legacy) {
        return multicallWrapper.raw([
            baseCall,
            {
                to: controller.address,
                data: controller.interface.encodeFunctionData('rentPrice', [names[0], 0]),
            },
        ]);
    }
    return baseCall;
};
const decode = async ({ contracts, multicallWrapper }, data, _nameOrNames, _duration, legacy) => {
    if (data === null)
        return;
    try {
        let base;
        let premium;
        if (Array.isArray(_nameOrNames) && _nameOrNames.length > 1) {
            const bulkRenewal = await contracts?.getBulkRenewal();
            const result = bulkRenewal.interface.decodeFunctionResult('rentPrice', data);
            base = result[0];
            premium = ethers_1.BigNumber.from(0);
        }
        else if (legacy) {
            const result = await multicallWrapper.decode(data);
            const [price] = ethers_1.utils.defaultAbiCoder.decode(['uint256'], result[0].returnData);
            [premium] = ethers_1.utils.defaultAbiCoder.decode(['uint256'], result[1].returnData);
            base = price.sub(premium);
        }
        else {
            const controller = await contracts?.getEthRegistrarController();
            const result = controller.interface.decodeFunctionResult('rentPrice', data);
            [base, premium] = result[0];
        }
        return {
            base,
            premium,
        };
    }
    catch {
        return;
    }
};
exports.default = { raw, decode };
