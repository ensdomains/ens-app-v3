// src/contracts/ethRegistrarController.ts
import { ETHRegistrarController__factory } from "../generated/factories/ETHRegistrarController__factory.mjs";
var ethRegistrarController_default = (provider, address) => ETHRegistrarController__factory.connect(address, provider);
export {
  ethRegistrarController_default as default
};
