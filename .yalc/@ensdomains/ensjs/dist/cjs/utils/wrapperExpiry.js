"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeExpiry = exports.MAX_EXPIRY = void 0;
const ethers_1 = require("ethers");
exports.MAX_EXPIRY = ethers_1.BigNumber.from(2).pow(64).sub(1);
const makeExpiry = async ({ getExpiry }, name, expiry) => {
    if (expiry) {
        if (expiry instanceof Date) {
            return ethers_1.BigNumber.from(expiry.getTime() / 1000);
        }
        else if (expiry instanceof ethers_1.BigNumber) {
            return expiry;
        }
        else {
            return ethers_1.BigNumber.from(expiry);
        }
    }
    else {
        if (name.endsWith('.eth')) {
            const expResponse = await getExpiry(name);
            if (!expResponse?.expiry)
                throw new Error("Couldn't get expiry for name, please provide one.");
            return ethers_1.BigNumber.from(expResponse.expiry.getTime() / 1000);
        }
        else {
            return exports.MAX_EXPIRY;
        }
    }
};
exports.makeExpiry = makeExpiry;
