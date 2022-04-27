import { solidityKeccak256 } from 'ethers/lib/utils';
const raw = async ({ contracts, multicallWrapper }, name) => {
    const baseRegistrar = await contracts?.getBaseRegistrar();
    const labels = name.split('.');
    if (labels.length > 2 || labels[1] !== 'eth') {
        throw new Error('Only .eth names have expiry dates');
    }
    const expiryCall = baseRegistrar.interface.encodeFunctionData('nameExpires', [
        solidityKeccak256(['string'], [labels[0]]),
    ]);
    const gracePeriodCall = baseRegistrar.interface.encodeFunctionData('GRACE_PERIOD');
    return multicallWrapper.raw([
        {
            to: baseRegistrar.address,
            data: expiryCall,
        },
        {
            to: baseRegistrar.address,
            data: gracePeriodCall,
        },
    ]);
};
const decode = async ({ contracts, multicallWrapper }, data) => {
    if (data === null)
        return null;
    const result = await multicallWrapper.decode(data);
    const baseRegistrar = await contracts?.getBaseRegistrar();
    try {
        const [nameExpires] = baseRegistrar.interface.decodeFunctionResult('nameExpires', result[0].returnData);
        const [gracePeriod] = baseRegistrar.interface.decodeFunctionResult('GRACE_PERIOD', result[1].returnData);
        return {
            expiry: nameExpires > 0 ? new Date(nameExpires * 1000) : null,
            gracePeriod: gracePeriod.toNumber() * 1000,
        };
    }
    catch {
        return null;
    }
};
export default {
    raw,
    decode,
};
