import { ReverseRegistrar__factory } from '../generated/factories/ReverseRegistrar__factory';
const defaultAddress = '0x6F628b68b30Dc3c17f345c9dbBb1E483c2b7aE5c';
export default (provider, address) => ReverseRegistrar__factory.connect(address || defaultAddress, provider);
