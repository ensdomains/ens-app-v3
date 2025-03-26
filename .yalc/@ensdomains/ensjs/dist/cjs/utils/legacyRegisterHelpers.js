"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLegacyCommitment = exports.makeLegacyCommitmentFromTuple = exports.makeLegacyRegistrationWithConfigTuple = exports.makeLegacyRegistrationTuple = exports.makeLegacyCommitmentWithConfigTuple = exports.makeLegacyCommitmentTuple = exports.isLegacyRegistrationWithConfigParameters = void 0;
const viem_1 = require("viem");
const consts_js_1 = require("./consts.js");
const register_js_1 = require("../errors/register.js");
const isLegacyRegistrationWithConfigParameters = (params) => {
    const { resolverAddress = consts_js_1.EMPTY_ADDRESS, address = consts_js_1.EMPTY_ADDRESS } = params;
    if (resolverAddress === consts_js_1.EMPTY_ADDRESS && address !== consts_js_1.EMPTY_ADDRESS)
        throw new register_js_1.LegacyRegistrationInvalidConfigError({
            resolverAddress,
            address,
        });
    return resolverAddress !== consts_js_1.EMPTY_ADDRESS || address !== consts_js_1.EMPTY_ADDRESS;
};
exports.isLegacyRegistrationWithConfigParameters = isLegacyRegistrationWithConfigParameters;
const makeLegacyCommitmentTuple = (params) => {
    const { name, owner, secret } = params;
    const label = name.split('.')[0];
    return [label, owner, secret];
};
exports.makeLegacyCommitmentTuple = makeLegacyCommitmentTuple;
const makeLegacyCommitmentWithConfigTuple = (params) => {
    const { name, owner, secret, resolverAddress = consts_js_1.EMPTY_ADDRESS, address = consts_js_1.EMPTY_ADDRESS, } = params;
    const label = name.split('.')[0];
    return [label, owner, secret, resolverAddress, address];
};
exports.makeLegacyCommitmentWithConfigTuple = makeLegacyCommitmentWithConfigTuple;
const makeLegacyRegistrationTuple = ({ name, owner, secret, duration, }) => {
    const label = name.split('.')[0];
    return [label, owner, BigInt(duration), secret];
};
exports.makeLegacyRegistrationTuple = makeLegacyRegistrationTuple;
const makeLegacyRegistrationWithConfigTuple = ({ name, owner, secret, duration, resolverAddress, address = consts_js_1.EMPTY_ADDRESS, }) => {
    const label = name.split('.')[0];
    return [label, owner, BigInt(duration), secret, resolverAddress, address];
};
exports.makeLegacyRegistrationWithConfigTuple = makeLegacyRegistrationWithConfigTuple;
const makeLegacyCommitmentFromTuple = ([label, ...others]) => {
    const labelHash = (0, viem_1.labelhash)(label);
    const params = [labelHash, ...others];
    if (params.length === 3)
        return (0, viem_1.keccak256)((0, viem_1.encodePacked)(['bytes32', 'address', 'bytes32'], params));
    const [owner, secret, resolverAddress = consts_js_1.EMPTY_ADDRESS, address = consts_js_1.EMPTY_ADDRESS,] = others;
    return (0, viem_1.keccak256)((0, viem_1.encodePacked)(['bytes32', 'address', 'address', 'address', 'bytes32'], [labelHash, owner, resolverAddress, address, secret]));
};
exports.makeLegacyCommitmentFromTuple = makeLegacyCommitmentFromTuple;
const makeLegacyCommitment = (params) => {
    const touple = (0, exports.isLegacyRegistrationWithConfigParameters)(params)
        ? (0, exports.makeLegacyCommitmentWithConfigTuple)(params)
        : (0, exports.makeLegacyCommitmentTuple)(params);
    return (0, exports.makeLegacyCommitmentFromTuple)(touple);
};
exports.makeLegacyCommitment = makeLegacyCommitment;
//# sourceMappingURL=legacyRegisterHelpers.js.map