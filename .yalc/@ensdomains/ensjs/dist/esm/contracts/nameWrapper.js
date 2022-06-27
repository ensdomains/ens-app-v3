import { NameWrapper__factory } from '../generated/factories/NameWrapper__factory';
export default (provider, address) => NameWrapper__factory.connect(address, provider);
