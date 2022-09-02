import { makeRegistrationData, } from '../utils/registerHelpers';
export default async function ({ contracts }, name, { resolverAddress, value, ...params }) {
    const labels = name.split('.');
    if (labels.length !== 2 || labels[1] !== 'eth')
        throw new Error('Currently only .eth TLD registrations are supported');
    const controller = await contracts.getEthRegistrarController();
    const _resolver = await contracts.getPublicResolver(undefined, resolverAddress);
    const generatedParams = makeRegistrationData({
        name,
        resolver: _resolver,
        ...params,
    });
    return controller.populateTransaction.register(...generatedParams, {
        value,
    });
}
