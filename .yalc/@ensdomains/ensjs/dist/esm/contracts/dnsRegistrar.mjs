// src/contracts/dnsRegistrar.ts
import { DNSRegistrar__factory } from "../generated/factories/DNSRegistrar__factory.mjs";
var dnsRegistrar_default = (provider, address) => DNSRegistrar__factory.connect(address, provider);
export {
  dnsRegistrar_default as default
};
