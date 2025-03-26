"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCommitment = exports.makeCommitmentFromTuple = exports.makeRegistrationTuple = exports.makeCommitmentTuple = exports.randomSecret = void 0;
const viem_1 = require("viem");
const utils_js_1 = require("../errors/utils.js");
const consts_js_1 = require("./consts.js");
const fuses_js_1 = require("./fuses.js");
const generateRecordCallArray_js_1 = require("./generateRecordCallArray.js");
const normalise_js_1 = require("./normalise.js");
const cryptoRef = (typeof crypto !== 'undefined' && crypto) ||
    (typeof window !== 'undefined' &&
        typeof window.crypto !== 'undefined' &&
        window.crypto) ||
    undefined;
const randomSecret = ({ platformDomain, campaign, } = {}) => {
    const bytes = cryptoRef.getRandomValues(new Uint8Array(32));
    if (platformDomain) {
        const hash = (0, viem_1.toBytes)((0, normalise_js_1.namehash)(platformDomain));
        for (let i = 0; i < 4; i += 1) {
            bytes[i] = hash[i];
        }
    }
    if (campaign) {
        if (campaign > 0xffffffff)
            throw new utils_js_1.CampaignReferenceTooLargeError({ campaign });
        const campaignBytes = (0, viem_1.pad)((0, viem_1.toBytes)(campaign), { size: 4 });
        for (let i = 0; i < 4; i += 1) {
            bytes[i + 4] = campaignBytes[i];
        }
    }
    return (0, viem_1.toHex)(bytes);
};
exports.randomSecret = randomSecret;
const makeCommitmentTuple = ({ name, owner, duration, resolverAddress = consts_js_1.EMPTY_ADDRESS, records: { coins = [], ...records } = { texts: [], coins: [] }, reverseRecord, fuses, secret, }) => {
    const labelHash = (0, viem_1.labelhash)(name.split('.')[0]);
    const hash = (0, normalise_js_1.namehash)(name);
    const fuseData = fuses
        ? (0, fuses_js_1.encodeFuses)({ restriction: 'child', input: fuses })
        : 0;
    if (reverseRecord &&
        !coins.find((c) => (typeof c.coin === 'string' && c.coin.toLowerCase() === 'eth') ||
            (typeof c.coin === 'string' ? parseInt(c.coin) === 60 : c.coin === 60))) {
        coins.push({ coin: 60, value: owner });
    }
    const data = records
        ? (0, generateRecordCallArray_js_1.generateRecordCallArray)({ namehash: hash, coins, ...records })
        : [];
    if (data.length > 0 && resolverAddress === consts_js_1.EMPTY_ADDRESS)
        throw new utils_js_1.ResolverAddressRequiredError({
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
exports.makeCommitmentTuple = makeCommitmentTuple;
const makeRegistrationTuple = (params) => {
    const [_labelhash, ...commitmentData] = (0, exports.makeCommitmentTuple)(params);
    const label = params.name.split('.')[0];
    return [label, ...commitmentData];
};
exports.makeRegistrationTuple = makeRegistrationTuple;
const makeCommitmentFromTuple = (params) => {
    return (0, viem_1.keccak256)((0, viem_1.encodeAbiParameters)([
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
exports.makeCommitmentFromTuple = makeCommitmentFromTuple;
const makeCommitment = (params) => (0, exports.makeCommitmentFromTuple)((0, exports.makeCommitmentTuple)(params));
exports.makeCommitment = makeCommitment;
//# sourceMappingURL=registerHelpers.js.map