export default async function ({ contracts, provider, transferSubname, }, name, contract, options) {
    return transferSubname(name, contract, '0x0000000000000000000000000000000000000000', options);
}
