import { UniversalResolver__factory } from '../generated/factories/UniversalResolver__factory';
export default (provider, address) => UniversalResolver__factory.connect(address, provider);
