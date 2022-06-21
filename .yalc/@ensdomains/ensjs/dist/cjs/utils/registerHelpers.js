"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._makeCommitment = exports.makeCommitment = exports.randomSecret = void 0;
const ethers_1 = require("ethers");
const generateFuseInput_1 = __importDefault(require("./generateFuseInput"));
const labels_1 = require("./labels");
const recordHelpers_1 = require("./recordHelpers");
const randomSecret = () => {
    const bytes = Buffer.allocUnsafe(32);
    return '0x' + crypto.getRandomValues(bytes).toString('hex');
};
exports.randomSecret = randomSecret;
const makeCommitment = ({ name, owner, duration, resolver, records, reverseRecord, fuses, }) => {
    const label = (0, labels_1.labelhash)(name.split('.')[0]);
    const namehash = ethers_1.utils.namehash(name);
    const resolverAddress = resolver.address;
    const data = records
        ? (0, recordHelpers_1.generateRecordCallArray)(namehash, records, resolver)
        : [];
    const secret = (0, exports.randomSecret)();
    const fuseData = fuses ? (0, generateFuseInput_1.default)(fuses) : '0';
    const commitment = (0, exports._makeCommitment)({
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
exports.makeCommitment = makeCommitment;
const _makeCommitment = ({ labelhash, owner, duration, secret, resolver, data, reverseRecord, fuses, }) => {
    return ethers_1.utils.solidityKeccak256([
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
exports._makeCommitment = _makeCommitment;
