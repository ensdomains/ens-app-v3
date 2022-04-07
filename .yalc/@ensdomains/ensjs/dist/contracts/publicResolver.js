import { PublicResolver__factory } from '../generated/factories/PublicResolver__factory';
const defaultAddress = '0xAEfF4f4d8e2cB51854BEa2244B3C5Fb36b41C7fC';
export default (provider, address) => PublicResolver__factory.connect(address || defaultAddress, provider);
