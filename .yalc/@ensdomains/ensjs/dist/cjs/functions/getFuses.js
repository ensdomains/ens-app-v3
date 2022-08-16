"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const fuses_1 = require("../utils/fuses");
const normalise_1 = require("../utils/normalise");
const NameSafety = [
    'Safe',
    'RegistrantNotWrapped',
    'ControllerNotWrapped',
    'SubdomainReplacementAllowed',
    'Expired',
];
const raw = async ({ contracts }, name) => {
    const nameWrapper = await contracts?.getNameWrapper();
    return {
        to: nameWrapper.address,
        data: nameWrapper.interface.encodeFunctionData('getData', [(0, normalise_1.namehash)(name)]),
    };
};
const decode = async ({ contracts }, data, name) => {
    const nameWrapper = await contracts?.getNameWrapper();
    try {
        const { owner, fuses: _fuses, expiry, } = nameWrapper.interface.decodeFunctionResult('getData', data);
        const fuses = ethers_1.BigNumber.from(_fuses);
        const fuseObj = Object.fromEntries(Object.keys(fuses_1.fuseEnum).map((fuse) => [
            fuse,
            fuses.and(fuses_1.fuseEnum[fuse]).gt(0),
        ]));
        if (fuses.eq(0)) {
            fuseObj.canDoEverything = true;
        }
        else {
            fuseObj.canDoEverything = false;
        }
        const expiryDate = new Date(expiry * 1000);
        return {
            fuseObj,
            expiryDate,
            rawFuses: fuses,
            owner,
        };
    }
    catch (e) {
        console.error('Error decoding fuses data: ', e);
        return;
    }
};
exports.default = {
    raw,
    decode,
};
