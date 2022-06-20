import { PublicResolver__factory } from '../generated/factories/PublicResolver__factory';
const defaultAddress = '0x9e6c745CAEdA0AB8a7AD0f393ef90dcb7C70074A';
export default (provider, address) => PublicResolver__factory.connect(address || defaultAddress, provider);
