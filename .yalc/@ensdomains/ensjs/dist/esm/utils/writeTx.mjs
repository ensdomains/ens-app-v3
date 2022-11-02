// src/utils/writeTx.ts
var withCustomData = (tx, customData) => customData ? { ...tx, customData } : tx;
var writeTx_default = (signer, populate) => ({ customData, ...tx }) => populate ? withCustomData(tx, customData) : signer.sendTransaction(tx).then((r) => withCustomData(r, customData));
export {
  writeTx_default as default
};
