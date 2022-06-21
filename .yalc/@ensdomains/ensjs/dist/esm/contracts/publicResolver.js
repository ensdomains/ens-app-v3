import { PublicResolver__factory } from '../generated/factories/PublicResolver__factory';
export default (provider, address) => PublicResolver__factory.connect(address, provider);
