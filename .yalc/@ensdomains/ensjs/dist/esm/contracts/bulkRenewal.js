import { BulkRenewal__factory } from '../generated/factories/BulkRenewal__factory';
// Use a higher-order function to overide the address that is passed in from getContractAddress()
export default (address) => (provider) => BulkRenewal__factory.connect(address, provider);
