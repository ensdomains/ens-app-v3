import { utils } from 'ethers';
import generateFuseInput from './generateFuseInput';
import { labelhash } from './labels';
import { namehash } from './normalise';
import { generateRecordCallArray } from './recordHelpers';
export const randomSecret = () => {
    const bytes = Buffer.allocUnsafe(32);
    return '0x' + crypto.getRandomValues(bytes).toString('hex');
};
export const makeCommitment = ({ name, owner, duration, resolver, records, reverseRecord, fuses, }) => {
    const label = labelhash(name.split('.')[0]);
    const hash = namehash(name);
    const resolverAddress = resolver.address;
    const data = records ? generateRecordCallArray(hash, records, resolver) : [];
    const secret = randomSecret();
    const fuseData = fuses ? generateFuseInput(fuses) : '0';
    const commitment = _makeCommitment({
        labelhash: label,
        owner,
        duration,
        secret,
        resolver: resolverAddress,
        data,
        reverseRecord: !!reverseRecord,
        fuses: fuseData,
    });
    return {
        secret,
        commitment,
    };
};
export const _makeCommitment = ({ labelhash, owner, duration, secret, resolver, data, reverseRecord, fuses, }) => {
    return utils.solidityKeccak256([
        'bytes32',
        'address',
        'uint256',
        'bytes32',
        'address',
        'bytes[]',
        'bool',
        'uint96',
    ], [labelhash, owner, duration, secret, resolver, data, reverseRecord, fuses]);
};
