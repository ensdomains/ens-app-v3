import { BaseRegistrarImplementation__factory } from '../generated/factories/BaseRegistrarImplementation__factory';
export default (provider, address) => BaseRegistrarImplementation__factory.connect(address, provider);
