import { BaseError, RawContractError } from 'viem';
export const getRevertErrorData = (err) => {
    if (!(err instanceof BaseError))
        return undefined;
    const error = err.walk();
    const hex = typeof error.data === 'object' ? error.data.data : error.data;
    if (hex === '0x')
        return undefined;
    return hex;
};
//# sourceMappingURL=getRevertErrorData.js.map