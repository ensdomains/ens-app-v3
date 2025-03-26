import { encodeAbiParameters, keccak256, labelhash, pad, toBytes, toHex, } from 'viem';
import { CampaignReferenceTooLargeError, ResolverAddressRequiredError, } from '../errors/utils.js';
import { EMPTY_ADDRESS } from './consts.js';
import { encodeFuses } from './fuses.js';
import { generateRecordCallArray, } from './generateRecordCallArray.js';
import { namehash } from './normalise.js';
const cryptoRef = (typeof crypto !== 'undefined' && crypto) ||
    (typeof window !== 'undefined' &&
        typeof window.crypto !== 'undefined' &&
        window.crypto) ||
    undefined;
export const randomSecret = ({ platformDomain, campaign, } = {}) => {
    const bytes = cryptoRef.getRandomValues(new Uint8Array(32));
    if (platformDomain) {
        const hash = toBytes(namehash(platformDomain));
        for (let i = 0; i < 4; i += 1) {
            bytes[i] = hash[i];
        }
    }
    if (campaign) {
        if (campaign > 0xffffffff)
            throw new CampaignReferenceTooLargeError({ campaign });
        const campaignBytes = pad(toBytes(campaign), { size: 4 });
        for (let i = 0; i < 4; i += 1) {
            bytes[i + 4] = campaignBytes[i];
        }
    }
    return toHex(bytes);
};
export const makeCommitmentTuple = ({ name, owner, duration, resolverAddress = EMPTY_ADDRESS, records: { coins = [], ...records } = { texts: [], coins: [] }, reverseRecord, fuses, secret, }) => {
    const labelHash = labelhash(name.split('.')[0]);
    const hash = namehash(name);
    const fuseData = fuses
        ? encodeFuses({ restriction: 'child', input: fuses })
        : 0;
    if (reverseRecord &&
        !coins.find((c) => (typeof c.coin === 'string' && c.coin.toLowerCase() === 'eth') ||
            (typeof c.coin === 'string' ? parseInt(c.coin) === 60 : c.coin === 60))) {
        coins.push({ coin: 60, value: owner });
    }
    const data = records
        ? generateRecordCallArray({ namehash: hash, coins, ...records })
        : [];
    if (data.length > 0 && resolverAddress === EMPTY_ADDRESS)
        throw new ResolverAddressRequiredError({
            data: {
                name,
                owner,
                duration,
                resolverAddress,
                records,
                reverseRecord,
                fuses,
            },
        });
    return [
        labelHash,
        owner,
        BigInt(duration),
        secret,
        resolverAddress,
        data,
        !!reverseRecord,
        fuseData,
    ];
};
export const makeRegistrationTuple = (params) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_labelhash, ...commitmentData] = makeCommitmentTuple(params);
    const label = params.name.split('.')[0];
    return [label, ...commitmentData];
};
export const makeCommitmentFromTuple = (params) => {
    return keccak256(encodeAbiParameters([
        { name: 'name', type: 'bytes32' },
        { name: 'owner', type: 'address' },
        { name: 'duration', type: 'uint256' },
        { name: 'secret', type: 'bytes32' },
        { name: 'resolver', type: 'address' },
        { name: 'data', type: 'bytes[]' },
        { name: 'reverseRecord', type: 'bool' },
        { name: 'ownerControlledFuses', type: 'uint16' },
    ], params));
};
export const makeCommitment = (params) => makeCommitmentFromTuple(makeCommitmentTuple(params));
//# sourceMappingURL=registerHelpers.js.map