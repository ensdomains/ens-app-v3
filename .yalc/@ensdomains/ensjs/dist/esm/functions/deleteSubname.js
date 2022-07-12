export default async function ({ transferSubname }, name, { contract, }) {
    return transferSubname(name, {
        contract,
        address: '0x0000000000000000000000000000000000000000',
    });
}
