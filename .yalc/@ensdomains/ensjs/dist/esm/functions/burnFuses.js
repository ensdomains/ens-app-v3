import { namehash } from '../utils/normalise';
import { fuseEnum } from '../utils/fuses';
export default async function ({ contracts, signer }, name, { fusesToBurn, }) {
    const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
    const hash = namehash(name);
    const encodedFuses = Array.from(fusesToBurn).reduce((previousValue, currentValue) => {
        return previousValue + fuseEnum[currentValue];
    }, 0);
    return nameWrapper.populateTransaction.setFuses(hash, encodedFuses);
}
