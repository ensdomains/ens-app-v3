import { ReverseRegistrar__factory } from '../generated/factories/ReverseRegistrar__factory';
const defaultAddress = '0x4696E2f7D9f4CA187155ff50D93C00172181ddd5';
export default (provider, address) => ReverseRegistrar__factory.connect(address || defaultAddress, provider);
