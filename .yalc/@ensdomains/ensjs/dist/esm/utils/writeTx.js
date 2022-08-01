export default (signer, populate) => (tx) => populate ? tx : signer.sendTransaction(tx);
