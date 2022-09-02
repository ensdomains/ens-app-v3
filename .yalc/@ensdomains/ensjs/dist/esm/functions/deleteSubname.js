export default async function ({ transferSubname, signer }, name, { contract, }) {
    return transferSubname.populateTransaction(name, {
        contract,
        owner: '0x0000000000000000000000000000000000000000',
        signer,
    });
}
