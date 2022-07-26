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
        data: nameWrapper.interface.encodeFunctionData('getFuses', [
            (0, normalise_1.namehash)(name),
        ]),
    };
};
const decode = async ({ contracts }, data, name) => {
    const nameWrapper = await contracts?.getNameWrapper();
    try {
        const [fuses, vulnerability, vulnerableNode] = nameWrapper.interface.decodeFunctionResult('getFuses', data);
        const fuseObj = Object.fromEntries(Object.keys(fuses_1.testable).map((fuseEnum) => [
            fuseEnum
                .toLowerCase()
                .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', '')),
            fuses.and(fuses_1.testable[fuseEnum]).gt(0),
        ]));
        if (fuses.eq(0)) {
            fuseObj.canDoEverything = true;
        }
        else {
            fuseObj.canDoEverything = false;
        }
        let returnVulnerableNode = null;
        if (ethers_1.utils.hexStripZeros(vulnerableNode) !== '0x') {
            name.split('.').forEach((label, index, arr) => {
                const node = arr.slice(index).join('.');
                const nodehash = (0, normalise_1.namehash)(node);
                if (nodehash === vulnerableNode) {
                    returnVulnerableNode = node;
                }
            });
        }
        return {
            fuseObj,
            vulnerability: NameSafety[vulnerability] || vulnerability,
            vulnerableNode: returnVulnerableNode,
            rawFuses: fuses,
        };
    }
    catch {
        return;
    }
};
exports.default = {
    raw,
    decode,
};
