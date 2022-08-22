"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const withCustomData = (tx, customData) => customData ? { ...tx, customData } : tx;
exports.default = (signer, populate) => ({ customData, ...tx }) => populate
    ? withCustomData(tx, customData)
    : signer.sendTransaction(tx).then((r) => withCustomData(r, customData));
