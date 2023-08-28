// src/contracts/multicall.ts
import { Multicall__factory } from "../generated/factories/Multicall__factory.mjs";
var multicall_default = (provider, address) => Multicall__factory.connect(address, provider);
export {
  multicall_default as default
};
