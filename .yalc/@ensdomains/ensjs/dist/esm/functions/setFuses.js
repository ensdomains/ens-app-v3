import { namehash } from '../utils/normalise';
import fuseEnum from '../utils/fuses';
export default async function ({ contracts, signer }, name, { selectedFuses }) {
    const fuseNumber = selectedFuses.reduce((previousValue, currentValue) => {
        return previousValue + fuseEnum[currentValue];
    }, 0);
    const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
    return nameWrapper.populateTransaction.setFuses(namehash(name), fuseNumber);
}
