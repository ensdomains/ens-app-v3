// src/contracts/publicResolver.ts
import { PublicResolver__factory } from "../generated/factories/PublicResolver__factory.mjs";
var publicResolver_default = (provider, address) => PublicResolver__factory.connect(address, provider);
export {
  publicResolver_default as default
};
