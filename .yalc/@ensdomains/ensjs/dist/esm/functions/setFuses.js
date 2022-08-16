import { namehash } from '../utils/normalise';
export default async function ({ contracts, signer }, name, { fuses }) {
    const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
    return nameWrapper.populateTransaction.setFuses(namehash(name), fuses);
}
