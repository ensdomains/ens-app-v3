"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const generateFuseInput_1 = __importDefault(require("../utils/generateFuseInput"));
const hexEncodedName_1 = require("../utils/hexEncodedName");
const wrapperExpiry_1 = require("../utils/wrapperExpiry");
async function wrapETH({ contracts }, labels, wrappedOwner, expiry, decodedFuses, resolverAddress, signer, address) {
    const nameWrapper = await contracts?.getNameWrapper();
    const baseRegistrar = (await contracts?.getBaseRegistrar()).connect(signer);
    const labelhash = ethers_1.ethers.utils.solidityKeccak256(['string'], [labels[0]]);
    const data = ethers_1.ethers.utils.defaultAbiCoder.encode(['string', 'address', 'uint32', 'uint64', 'address'], [labels[0], wrappedOwner, decodedFuses, expiry, resolverAddress]);
    return baseRegistrar.populateTransaction['safeTransferFrom(address,address,uint256,bytes)'](address, nameWrapper.address, labelhash, data);
}
async function wrapOther({ contracts }, name, wrappedOwner, resolverAddress, address, signer) {
    const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
    const registry = await contracts?.getRegistry();
    const hasApproval = await registry.isApprovedForAll(address, nameWrapper.address);
    if (!hasApproval) {
        throw new Error('NameWrapper must have approval to wrap a name from this address.');
    }
    return nameWrapper.populateTransaction.wrap((0, hexEncodedName_1.hexEncodeName)(name), wrappedOwner, resolverAddress);
}
async function default_1({ contracts, signer, getExpiry, }, name, { wrappedOwner, fuseOptions, expiry, resolverAddress, }) {
    const address = await signer.getAddress();
    let decodedFuses;
    const publicResolver = await contracts?.getPublicResolver();
    if (!resolverAddress)
        resolverAddress = publicResolver.address;
    const labels = name.split('.');
    if (labels.length === 2 && labels[1] === 'eth') {
        switch (typeof fuseOptions) {
            case 'object': {
                decodedFuses = (0, generateFuseInput_1.default)(fuseOptions);
                break;
            }
            case 'number': {
                decodedFuses = fuseOptions.toString(16);
                break;
            }
            case 'string': {
                decodedFuses = fuseOptions;
                break;
            }
            case 'undefined': {
                decodedFuses = '0';
                break;
            }
            default: {
                throw new Error(`Invalid fuseOptions type: ${typeof fuseOptions}`);
            }
        }
        const expiryToUse = await (0, wrapperExpiry_1.makeExpiry)({ getExpiry }, name, expiry);
        return wrapETH({ contracts }, labels, wrappedOwner, expiryToUse, decodedFuses, resolverAddress, signer, address);
    }
    else {
        if (fuseOptions)
            throw new Error('Fuses can not be initially set when wrapping a non .eth name');
        if (expiry)
            throw new Error('Expiry can not be initially set when wrapping a non .eth name');
        return wrapOther({ contracts }, name, wrappedOwner, resolverAddress, address, signer);
    }
}
exports.default = default_1;
