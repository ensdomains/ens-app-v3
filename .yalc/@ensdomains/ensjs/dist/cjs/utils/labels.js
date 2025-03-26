"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptName = exports.checkIsDecrypted = exports.checkLabel = exports.saveName = exports.saveLabel = exports.isEncodedLabelhash = exports.encodeLabelhash = exports.decodeLabelhash = void 0;
const viem_1 = require("viem");
const utils_js_1 = require("../errors/utils.js");
const hasLocalStorage = typeof localStorage !== 'undefined';
function decodeLabelhash(hash) {
    if (!(hash.startsWith('[') && hash.endsWith(']')))
        throw new utils_js_1.InvalidEncodedLabelError({
            label: hash,
            details: 'Expected encoded labelhash to start and end with square brackets',
        });
    if (hash.length !== 66)
        throw new utils_js_1.InvalidEncodedLabelError({
            label: hash,
            details: 'Expected encoded labelhash to have a length of 66',
        });
    return `0x${hash.slice(1, -1)}`;
}
exports.decodeLabelhash = decodeLabelhash;
function encodeLabelhash(hash) {
    if (!hash.startsWith('0x'))
        throw new utils_js_1.InvalidLabelhashError({
            labelhash: hash,
            details: 'Expected labelhash to start with 0x',
        });
    if (hash.length !== 66)
        throw new utils_js_1.InvalidLabelhashError({
            labelhash: hash,
            details: 'Expected labelhash to have a length of 66',
        });
    return `[${hash.slice(2)}]`;
}
exports.encodeLabelhash = encodeLabelhash;
function isEncodedLabelhash(hash) {
    return hash.startsWith('[') && hash.endsWith(']') && hash.length === 66;
}
exports.isEncodedLabelhash = isEncodedLabelhash;
function getLabels() {
    return hasLocalStorage
        ? JSON.parse(localStorage.getItem('ensjs:labels')) || {}
        : {};
}
function _saveLabel(hash, label) {
    if (!hasLocalStorage)
        return hash;
    const labels = getLabels();
    localStorage.setItem('ensjs:labels', JSON.stringify({
        ...labels,
        [hash]: label,
    }));
    return hash;
}
function saveLabel(label) {
    const hash = `${(0, viem_1.labelhash)(label.toLowerCase())}`;
    return _saveLabel(hash, label);
}
exports.saveLabel = saveLabel;
function saveName(name) {
    const nameArray = name.split('.');
    for (const label of nameArray) {
        if (!isEncodedLabelhash(label)) {
            saveLabel(label);
        }
    }
}
exports.saveName = saveName;
function checkLabel(hash) {
    const labels = getLabels();
    if (isEncodedLabelhash(hash)) {
        return labels[decodeLabelhash(hash)] || hash;
    }
    return hash;
}
exports.checkLabel = checkLabel;
function checkIsDecrypted(string) {
    return !string?.includes('[');
}
exports.checkIsDecrypted = checkIsDecrypted;
function decryptName(name) {
    return name
        .split('.')
        .map((label) => checkLabel(label))
        .join('.');
}
exports.decryptName = decryptName;
//# sourceMappingURL=labels.js.map