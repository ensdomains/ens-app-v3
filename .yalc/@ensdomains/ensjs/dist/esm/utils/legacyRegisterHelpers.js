import { keccak256, labelhash, encodePacked, } from 'viem';
import { EMPTY_ADDRESS } from './consts.js';
import { LegacyRegistrationInvalidConfigError } from '../errors/register.js';
export const isLegacyRegistrationWithConfigParameters = (params) => {
    const { resolverAddress = EMPTY_ADDRESS, address = EMPTY_ADDRESS } = params;
    if (resolverAddress === EMPTY_ADDRESS && address !== EMPTY_ADDRESS)
        throw new LegacyRegistrationInvalidConfigError({
            resolverAddress,
            address,
        });
    return resolverAddress !== EMPTY_ADDRESS || address !== EMPTY_ADDRESS;
};
export const makeLegacyCommitmentTuple = (params) => {
    const { name, owner, secret } = params;
    const label = name.split('.')[0];
    return [label, owner, secret];
};
export const makeLegacyCommitmentWithConfigTuple = (params) => {
    const { name, owner, secret, resolverAddress = EMPTY_ADDRESS, address = EMPTY_ADDRESS, } = params;
    const label = name.split('.')[0];
    return [label, owner, secret, resolverAddress, address];
};
export const makeLegacyRegistrationTuple = ({ name, owner, secret, duration, }) => {
    const label = name.split('.')[0];
    return [label, owner, BigInt(duration), secret];
};
export const makeLegacyRegistrationWithConfigTuple = ({ name, owner, secret, duration, resolverAddress, address = EMPTY_ADDRESS, }) => {
    const label = name.split('.')[0];
    return [label, owner, BigInt(duration), secret, resolverAddress, address];
};
export const makeLegacyCommitmentFromTuple = ([label, ...others]) => {
    const labelHash = labelhash(label);
    const params = [labelHash, ...others];
    if (params.length === 3)
        return keccak256(encodePacked(['bytes32', 'address', 'bytes32'], params));
    const [owner, secret, resolverAddress = EMPTY_ADDRESS, address = EMPTY_ADDRESS,] = others;
    return keccak256(encodePacked(['bytes32', 'address', 'address', 'address', 'bytes32'], [labelHash, owner, resolverAddress, address, secret]));
};
export const makeLegacyCommitment = (params) => {
    const touple = isLegacyRegistrationWithConfigParameters(params)
        ? makeLegacyCommitmentWithConfigTuple(params)
        : makeLegacyCommitmentTuple(params);
    return makeLegacyCommitmentFromTuple(touple);
};
//# sourceMappingURL=legacyRegisterHelpers.js.map