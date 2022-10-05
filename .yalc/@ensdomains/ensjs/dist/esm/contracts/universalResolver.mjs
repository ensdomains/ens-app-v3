// src/contracts/universalResolver.ts
import { UniversalResolver__factory } from "../generated/factories/UniversalResolver__factory.mjs";
var universalResolver_default = (provider, address) => UniversalResolver__factory.connect(address, provider);
export {
  universalResolver_default as default
};
