import { ENSRegistry__factory } from '../generated/factories/ENSRegistry__factory';
export default (provider, address) => ENSRegistry__factory.connect(address, provider);
