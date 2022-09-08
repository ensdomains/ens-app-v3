import { solidityKeccak256 } from 'ethers/lib/utils';
import { truncateFormat } from './format';
const hasLocalStorage = typeof localStorage !== 'undefined';
export const labelhash = (input) => solidityKeccak256(['string'], [input]);
export const keccakFromString = (input) => labelhash(input);
export function decodeLabelhash(hash) {
    if (!(hash.startsWith('[') && hash.endsWith(']'))) {
        throw Error('Expected encoded labelhash to start and end with square brackets');
    }
    if (hash.length !== 66) {
        throw Error('Expected encoded labelhash to have a length of 66');
    }
    return `0x${hash.slice(1, -1)}`;
}
export function encodeLabelhash(hash) {
    if (!hash.startsWith('0x')) {
        throw new Error('Expected label hash to start with 0x');
    }
    if (hash.length !== 66) {
        throw new Error('Expected label hash to have a length of 66');
    }
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
    nameArray.forEach((label) => {
        saveLabel(label);
    });
}
// eslint-disable-next-line consistent-return
export function checkLabel(hash) {
    const labels = getLabels();
    if (isEncodedLabelhash(hash)) {
        return labels[decodeLabelhash(hash)];
    }
    if (hash.startsWith('0x')) {
        return labels[`${hash.slice(2)}`];
    }
}
export function encodeLabel(label) {
    try {
        return encodeLabelhash(label);
    }
    catch {
        return label;
    }
}
export function parseName(name) {
    const nameArray = name.split('.');
    return nameArray.map((label) => encodeLabel(label)).join('.');
}
export function checkIsDecrypted(string) {
    return !string?.includes('[');
}
export function decryptName(name) {
    return name
        .split('.')
        .map((label) => checkLabel(label) || label)
        .join('.');
}
export const truncateUndecryptedName = (name) => truncateFormat(name);
export function checkLocalStorageSize() {
    if (!hasLocalStorage)
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
