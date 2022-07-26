import { ReverseRegistrar__factory } from '../generated/factories/ReverseRegistrar__factory';
export default (provider, address) => ReverseRegistrar__factory.connect(address, provider);
