import { concat, keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import uts46 from 'idna-uts46-hx/uts46bundle.js';
const zeros = new Uint8Array(32);
zeros.fill(0);
export const normalise = (name) => name ? uts46.toUnicode(name, { useStd3ASCII: true }) : name;
export const namehash = (inputName) => {
    let result = zeros;
    const name = normalise(inputName);
    if (name) {
        const labels = name.split('.');
        for (var i = labels.length - 1; i >= 0; i--) {
            const labelSha = keccak256(toUtf8Bytes(labels[i]));
            result = keccak256(concat([result, labelSha]));
        }
    }
    return result;
};
