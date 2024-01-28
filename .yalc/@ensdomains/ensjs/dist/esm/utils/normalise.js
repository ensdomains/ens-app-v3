import { ens_beautify, ens_emoji, ens_normalize, ens_normalize_fragment, ens_split, ens_tokenize, is_combining_mark, should_escape, } from '@adraffy/ens-normalize';
import { bytesToHex, concat, hexToBytes, keccak256, stringToBytes } from 'viem';
import { decodeLabelhash, isEncodedLabelhash } from './labels.js';
const zeros = new Uint8Array(32);
zeros.fill(0);
export const normalise = (name) => (name ? ens_normalize(name) : name);
export function namehash(name) {
    let result = new Uint8Array(32).fill(0);
    if (!name)
        return bytesToHex(result);
    const labels = name.split('.');
    // Iterate in reverse order building up hash
    for (let i = labels.length - 1; i >= 0; i -= 1) {
        let labelSha;
        if (isEncodedLabelhash(labels[i])) {
            labelSha = hexToBytes(decodeLabelhash(labels[i]));
        }
        else {
            const normalised = normalise(labels[i]);
            labelSha = keccak256(stringToBytes(normalised), 'bytes');
        }
        result = keccak256(concat([result, labelSha]), 'bytes');
    }
    return bytesToHex(result);
}
export const beautify = ens_beautify;
export const emoji = ens_emoji;
export const normaliseFragment = ens_normalize_fragment;
export const split = ens_split;
export const tokenise = ens_tokenize;
export const isCombiningMark = is_combining_mark;
export const shouldEscape = should_escape;
//# sourceMappingURL=normalise.js.map