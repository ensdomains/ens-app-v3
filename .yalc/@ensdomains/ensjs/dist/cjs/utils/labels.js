"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLocalStorageSize = exports.truncateUndecryptedName = exports.decryptName = exports.checkIsDecrypted = exports.parseName = exports.encodeLabel = exports.checkLabel = exports.saveName = exports.saveLabel = exports.isEncodedLabelhash = exports.encodeLabelhash = exports.decodeLabelhash = exports.labelhash = void 0;
const utils_1 = require("ethers/lib/utils");
const labelhash = (input) => (0, utils_1.solidityKeccak256)(['string'], [input]);
exports.labelhash = labelhash;
function decodeLabelhash(hash) {
    if (!(hash.startsWith('[') && hash.endsWith(']'))) {
        throw Error('Expected encoded labelhash to start and end with square brackets');
    }
    if (hash.length !== 66) {
        throw Error('Expected encoded labelhash to have a length of 66');
    }
    return `${hash.slice(1, -1)}`;
}
exports.decodeLabelhash = decodeLabelhash;
function encodeLabelhash(hash) {
    if (!hash.startsWith('0x')) {
        throw new Error('Expected label hash to start with 0x');
    }
    if (hash.length !== 66) {
        throw new Error('Expected label hash to have a length of 66');
    }
    return `[${hash.slice(2)}]`;
}
exports.encodeLabelhash = encodeLabelhash;
function isEncodedLabelhash(hash) {
    return hash.startsWith('[') && hash.endsWith(']') && hash.length === 66;
}
exports.isEncodedLabelhash = isEncodedLabelhash;
function getLabels() {
    return localStorage
        ? JSON.parse(localStorage.getItem('ensjs:labels')) || {}
        : {};
}
function _saveLabel(hash, label) {
    if (!localStorage)
        return hash;
    const labels = getLabels();
    localStorage.setItem('ensjs:labels', JSON.stringify({
        ...labels,
        [hash]: label,
    }));
    return hash;
}
function saveLabel(label) {
    const hash = `${(0, exports.labelhash)(label.toLowerCase())}`;
    return _saveLabel(hash, label);
}
exports.saveLabel = saveLabel;
function saveName(name) {
    const nameArray = name.split('.');
    nameArray.forEach((label) => {
        saveLabel(label);
    });
}
exports.saveName = saveName;
// eslint-disable-next-line consistent-return
function checkLabel(hash) {
    const labels = getLabels();
    if (isEncodedLabelhash(hash)) {
        return labels[decodeLabelhash(hash)];
    }
    if (hash.startsWith('0x')) {
        return labels[`${hash.slice(2)}`];
    }
}
exports.checkLabel = checkLabel;
function encodeLabel(label) {
    try {
        return encodeLabelhash(label);
    }
    catch {
        return label;
    }
}
exports.encodeLabel = encodeLabel;
function parseName(name) {
    const nameArray = name.split('.');
    return nameArray.map((label) => encodeLabel(label)).join('.');
}
exports.parseName = parseName;
function checkIsDecrypted(string) {
    return !string?.includes('[');
}
exports.checkIsDecrypted = checkIsDecrypted;
function decryptName(name) {
    return name
        .split('.')
        .map((label) => checkLabel(label) || label)
        .join('.');
}
exports.decryptName = decryptName;
function truncateUndecryptedName(name) {
    const nameArray = name.split('.');
    const truncatedArray = nameArray.map((label) => {
        if (checkIsDecrypted(label))
            return label;
        return `${label.slice(0, 5)}...${label.slice(60)}`;
    });
    return truncatedArray.join('.');
}
exports.truncateUndecryptedName = truncateUndecryptedName;
function checkLocalStorageSize() {
    if (!localStorage)
        return 'Empty (0 KB)';
    let allStrings = '';
    for (const key in window.localStorage) {
        if (Object.prototype.hasOwnProperty.call(window.localStorage, key)) {
            allStrings += window.localStorage[key];
        }
    }
    return allStrings
        ? `${3 + (allStrings.length * 16) / (8 * 1024)} KB`
        : 'Empty (0 KB)';
}
exports.checkLocalStorageSize = checkLocalStorageSize;
