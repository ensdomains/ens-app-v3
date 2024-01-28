import { stringToBytes } from 'viem';
import { WrappedLabelTooLargeError } from '../errors/utils.js';
export const MAX_EXPIRY = 2n ** 64n - 1n;
export const expiryToBigInt = (expiry, defaultValue = 0n) => {
    if (!expiry)
        return defaultValue;
    if (typeof expiry === 'bigint')
        return expiry;
    if (typeof expiry === 'string' || typeof expiry === 'number')
        return BigInt(expiry);
    if (expiry instanceof Date)
        return BigInt(Math.floor(expiry.getTime() / 1000));
    throw new TypeError('Expiry must be a bigint, string, number or Date');
};
export const wrappedLabelLengthCheck = (label) => {
    const bytes = stringToBytes(label);
    if (bytes.byteLength > 255)
        throw new WrappedLabelTooLargeError({ label, byteLength: bytes.byteLength });
};
//# sourceMappingURL=wrapper.js.map