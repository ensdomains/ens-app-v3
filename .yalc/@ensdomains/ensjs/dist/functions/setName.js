export default async function ({ contracts, provider }, name) {
    const address = await provider?.getSigner().getAddress();
    if (!address) {
        throw new Error('No signer found');
    }
    const reverseRegistrar = (await contracts?.getReverseRegistrar())?.connect(provider?.getSigner());
    return reverseRegistrar?.setName(name);
}
