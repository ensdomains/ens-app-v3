import { BigNumber } from 'ethers';
export const MAX_EXPIRY = BigNumber.from(2).pow(64).sub(1);
export const makeExpiry = async ({ getExpiry }, name, expiry) => {
    if (expiry) {
        if (expiry instanceof Date) {
            return BigNumber.from(expiry.getTime() / 1000);
        }
        else if (expiry instanceof BigNumber) {
            return expiry;
        }
        else {
            return BigNumber.from(expiry);
        }
    }
    else {
        if (name.endsWith('.eth')) {
            const expResponse = await getExpiry(name);
            if (!expResponse?.expiry)
                throw new Error("Couldn't get expiry for name, please provide one.");
            return BigNumber.from(expResponse.expiry.getTime() / 1000);
        }
        else {
            return MAX_EXPIRY;
        }
    }
};
