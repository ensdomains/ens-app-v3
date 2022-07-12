import generateFuseInput from '../utils/generateFuseInput';
import { namehash } from '../utils/normalise';
export default async function ({ contracts, signer }, name, { fusesToBurn, }) {
    const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
    const hash = namehash(name);
    const encodedFuses = generateFuseInput(fusesToBurn);
    return nameWrapper.burnFuses(hash, encodedFuses);
}
