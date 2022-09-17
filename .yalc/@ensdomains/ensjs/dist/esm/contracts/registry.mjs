// src/contracts/registry.ts
import { ENSRegistry__factory } from "../generated/factories/ENSRegistry__factory.mjs";
var registry_default = (provider, address) => ENSRegistry__factory.connect(address, provider);
export {
  registry_default as default
};
