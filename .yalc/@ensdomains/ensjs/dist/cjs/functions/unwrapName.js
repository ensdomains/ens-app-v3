"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const normalise_1 = require("../utils/normalise");
async function default_1({ contracts, signer }, name, { newController, newRegistrant, }) {
    const labels = name.split('.');
    const labelhash = ethers_1.utils.solidityKeccak256(['string'], [labels[0]]);
    const parentNodehash = (0, normalise_1.namehash)(labels.slice(1).join('.'));
    const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
    if (labels.length === 2 && labels[1] === 'eth') {
        if (!newRegistrant) {
            throw new Error('newRegistrant must be specified for .eth names');
        }
        return nameWrapper.populateTransaction.unwrapETH2LD(labelhash, newRegistrant, newController);
    }
    else {
        if (newRegistrant) {
            throw new Error('newRegistrant can only be specified for .eth names');
        }
        return nameWrapper.populateTransaction.unwrap(parentNodehash, labelhash, newController);
    }
}
exports.default = default_1;
