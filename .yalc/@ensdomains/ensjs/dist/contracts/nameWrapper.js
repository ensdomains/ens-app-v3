import { NameWrapper__factory } from '../generated/factories/NameWrapper__factory';
const defaultAddress = '0xD678D5259862431F17a556515948D450B5934773';
export default (provider, address) => NameWrapper__factory.connect(address || defaultAddress, provider);
