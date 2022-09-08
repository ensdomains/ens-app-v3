import { utils } from 'ethers';
import generateFuseInput from './generateFuseInput';
import { labelhash } from './labels';
import { namehash } from './normalise';
import { generateRecordCallArray } from './recordHelpers';
export const randomSecret = () => {
    const bytes = Buffer.allocUnsafe(32);
    return '0x' + crypto.getRandomValues(bytes).toString('hex');
};
export const makeCommitmentData = ({ name, owner, duration, resolver, records, reverseRecord, fuses, wrapperExpiry, secret, }) => {
    const label = labelhash(name.split('.')[0]);
    const hash = namehash(name);
    const resolverAddress = resolver.address;
    const fuseData = fuses ? generateFuseInput(fuses) : '0';
    if (reverseRecord) {
        if (!records) {
            records = { coinTypes: [{ key: 'ETH', value: owner }] };
        }
        else if (!records.coinTypes?.find((c) => c.key === 'ETH')) {
            if (!records.coinTypes)
                records.coinTypes = [];
            records.coinTypes.push({ key: 'ETH', value: owner });
        }
    }
    const data = records ? generateRecordCallArray(hash, records, resolver) : [];
    return [
        label,
        owner,
        duration,
        resolverAddress,
        data,
        secret,
        !!reverseRecord,
        fuseData,
        wrapperExpiry || Math.floor(Date.now() / 1000) + duration,
    ];
};
export const makeRegistrationData = (params) => {
    const commitmentData = makeCommitmentData(params);
    commitmentData[0] = params.name.split('.')[0];
    const secret = commitmentData.splice(5, 1)[0];
    commitmentData.splice(3, 0, secret);
    return commitmentData;
};
export const makeCommitment = ({ secret = randomSecret(), ...inputParams }) => {
    const generatedParams = makeCommitmentData({
        ...inputParams,
        secret,
    });
    const commitment = _makeCommitment(generatedParams);
    return {
        secret,
        commitment,
        wrapperExpiry: generatedParams[8],
    };
};
export const _makeCommitment = (params) => {
    return utils.keccak256(utils.defaultAbiCoder.encode([
        'bytes32',
        'address',
        'uint256',
        'address',
        'bytes[]',
        'bytes32',
        'bool',
        'uint32',
        'uint64',
    ], params));
};
