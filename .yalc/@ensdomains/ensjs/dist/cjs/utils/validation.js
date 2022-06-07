"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInputType = exports.validateTLD = exports.validateName = void 0;
const eth_ens_namehash_1 = require("@ensdomains/eth-ens-namehash");
const utils_1 = require("ethers/lib/utils");
const labels_1 = require("./labels");
const validateName = (name) => {
    const nameArray = name.split('.');
    const hasEmptyLabels = nameArray.some((label) => label.length == 0);
    if (hasEmptyLabels)
        throw new Error('Name cannot have empty labels');
    const normalizedArray = nameArray.map((label) => {
        if (label === '[root]') {
            return label;
        }
        else {
            return (0, labels_1.isEncodedLabelhash)(label) ? label : (0, eth_ens_namehash_1.normalize)(label);
        }
    });
    const normalizedName = normalizedArray.join('.');
    (0, labels_1.saveName)(normalizedName);
    return normalizedName;
};
exports.validateName = validateName;
const validateTLD = (name) => {
    const labels = name.split('.');
    return (0, exports.validateName)(labels[labels.length - 1]);
};
exports.validateTLD = validateTLD;
const parseInputType = (input) => {
    const validTLD = (0, exports.validateTLD)(input);
    let regex = /[^.]+$/;
    try {
        (0, exports.validateName)(input);
    }
    catch (e) {
        return {
            type: 'unknown',
        };
    }
    if (input.indexOf('.') !== -1) {
        const termArray = input.split('.');
        const tld = input.match(regex) ? input.match(regex)[0] : '';
        if (validTLD) {
            if (tld === 'eth' && [...termArray[termArray.length - 2]].length < 3) {
                // code-point length
                return {
                    type: 'name',
                    info: 'short',
                };
            }
            return {
                type: 'name',
                info: 'supported',
            };
        }
        return {
            type: 'name',
            info: 'unsupported',
        };
    }
    else if ((0, utils_1.isAddress)(input)) {
        return {
            type: 'address',
        };
    }
    else {
        return {
            type: 'label',
        };
    }
};
exports.parseInputType = parseInputType;
