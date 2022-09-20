// src/contracts/reverseRegistrar.ts
import { ReverseRegistrar__factory } from "../generated/factories/ReverseRegistrar__factory.mjs";
var reverseRegistrar_default = (provider, address) => ReverseRegistrar__factory.connect(address, provider);
export {
  reverseRegistrar_default as default
};
