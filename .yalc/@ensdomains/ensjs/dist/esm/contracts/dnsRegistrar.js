import { DNSRegistrar__factory } from '../generated/factories/DNSRegistrar__factory';
export default (provider, address) => DNSRegistrar__factory.connect(address, provider);
