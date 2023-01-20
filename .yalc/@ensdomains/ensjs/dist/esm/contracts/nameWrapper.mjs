// src/contracts/nameWrapper.ts
import { NameWrapper__factory } from "../generated/factories/NameWrapper__factory.mjs";
var nameWrapper_default = (provider, address) => NameWrapper__factory.connect(address, provider);
export {
  nameWrapper_default as default
};
