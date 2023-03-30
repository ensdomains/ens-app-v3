// src/contracts/baseRegistrar.ts
import { BaseRegistrarImplementation__factory } from "../generated/factories/BaseRegistrarImplementation__factory.mjs";
var baseRegistrar_default = (provider, address) => BaseRegistrarImplementation__factory.connect(address, provider);
export {
  baseRegistrar_default as default
};
