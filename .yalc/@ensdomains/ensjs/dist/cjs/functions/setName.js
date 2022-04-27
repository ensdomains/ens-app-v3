"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function default_1({ contracts, provider }, name, address, resolver, options) {
    const signerAddress = await provider
        ?.getSigner(options?.addressOrIndex)
        .getAddress();
    if (!signerAddress) {
        throw new Error('No signer found');
    }
    const reverseRegistrar = (await contracts?.getReverseRegistrar())?.connect(provider?.getSigner());
    if (address) {
        const publicResolver = await contracts?.getPublicResolver();
        return reverseRegistrar?.setNameForAddr(address, signerAddress, resolver || publicResolver.address, name);
    }
    return reverseRegistrar?.setName(name);
}
exports.default = default_1;
