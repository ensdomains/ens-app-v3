const withCustomData = (tx, customData) => customData ? { ...tx, customData } : tx;
export default (signer, populate) => ({ customData, ...tx }) => populate
    ? withCustomData(tx, customData)
    : signer.sendTransaction(tx).then((r) => withCustomData(r, customData));
