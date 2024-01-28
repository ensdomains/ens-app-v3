import { labelhash } from 'viem';
import { InvalidEncodedLabelError, InvalidLabelhashError, } from '../errors/utils.js';
const hasLocalStorage = typeof localStorage !== 'undefined';
export function decodeLabelhash(hash) {
    if (!(hash.startsWith('[') && hash.endsWith(']')))
        throw new InvalidEncodedLabelError({
            label: hash,
            details: 'Expected encoded labelhash to start and end with square brackets',
        });
    if (hash.length !== 66)
        throw new InvalidEncodedLabelError({
            label: hash,
            details: 'Expected encoded labelhash to have a length of 66',
        });
    return `0x${hash.slice(1, -1)}`;
}
export function encodeLabelhash(hash) {
    if (!hash.startsWith('0x'))
        throw new InvalidLabelhashError({
            labelhash: hash,
            details: 'Expected labelhash to start with 0x',
        });
    if (hash.length !== 66)
        throw new InvalidLabelhashError({
            labelhash: hash,
            details: 'Expected labelhash to have a length of 66',
        });
    return `[${hash.slice(2)}]`;
}
export function isEncodedLabelhash(hash) {
    return hash.startsWith('[') && hash.endsWith(']') && hash.length === 66;
}
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
export function saveLabel(label) {
    const hash = `${labelhash(label.toLowerCase())}`;
    return _saveLabel(hash, label);
}
export function saveName(name) {
    const nameArray = name.split('.');
    for (const label of nameArray) {
        if (!isEncodedLabelhash(label)) {
            saveLabel(label);
        }
    }
}
export function checkLabel(hash) {
    const labels = getLabels();
    if (isEncodedLabelhash(hash)) {
        return labels[decodeLabelhash(hash)] || hash;
    }
    return hash;
}
export function checkIsDecrypted(string) {
    return !string?.includes('[');
}
export function decryptName(name) {
    return name
        .split('.')
        .map((label) => checkLabel(label))
        .join('.');
}
//# sourceMappingURL=labels.js.map