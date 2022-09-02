"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._makeCommitment = exports.makeCommitment = exports.makeRegistrationData = exports.makeCommitmentData = exports.randomSecret = void 0;
const ethers_1 = require("ethers");
const generateFuseInput_1 = __importDefault(require("./generateFuseInput"));
const labels_1 = require("./labels");
const normalise_1 = require("./normalise");
const recordHelpers_1 = require("./recordHelpers");
const randomSecret = () => {
    const bytes = Buffer.allocUnsafe(32);
    return '0x' + crypto.getRandomValues(bytes).toString('hex');
};
exports.randomSecret = randomSecret;
const makeCommitmentData = ({ name, owner, duration, resolver, records, reverseRecord, fuses, wrapperExpiry, secret, }) => {
    const label = (0, labels_1.labelhash)(name.split('.')[0]);
    const hash = (0, normalise_1.namehash)(name);
    const resolverAddress = resolver.address;
    const fuseData = fuses ? (0, generateFuseInput_1.default)(fuses) : '0';
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
    const data = records ? (0, recordHelpers_1.generateRecordCallArray)(hash, records, resolver) : [];
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
exports.makeCommitmentData = makeCommitmentData;
const makeRegistrationData = (params) => {
    const commitmentData = (0, exports.makeCommitmentData)(params);
    commitmentData[0] = params.name.split('.')[0];
    const secret = commitmentData.splice(5, 1)[0];
    commitmentData.splice(3, 0, secret);
    return commitmentData;
};
exports.makeRegistrationData = makeRegistrationData;
const makeCommitment = ({ secret = (0, exports.randomSecret)(), ...inputParams }) => {
    const generatedParams = (0, exports.makeCommitmentData)({
        ...inputParams,
        secret,
    });
    const commitment = (0, exports._makeCommitment)(generatedParams);
    return {
        secret,
        commitment,
        wrapperExpiry: generatedParams[8],
    };
};
exports.makeCommitment = makeCommitment;
const _makeCommitment = (params) => {
    return ethers_1.utils.keccak256(ethers_1.utils.defaultAbiCoder.encode([
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
exports._makeCommitment = _makeCommitment;
