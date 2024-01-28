import { MAX_DATE_INT } from './consts.js';
export const makeSafeSecondsDate = (seconds) => {
    const milliseconds = BigInt(seconds) * 1000n;
    if (milliseconds > BigInt(MAX_DATE_INT))
        return new Date(MAX_DATE_INT);
    return new Date(Number(milliseconds));
};
//# sourceMappingURL=makeSafeSecondsDate.js.map