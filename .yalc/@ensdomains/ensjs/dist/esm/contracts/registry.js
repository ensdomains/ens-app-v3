import { ENSRegistry__factory } from '../generated/factories/ENSRegistry__factory';
const defaultAddress = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e';
export default (provider, address) => ENSRegistry__factory.connect(address || defaultAddress, provider);
