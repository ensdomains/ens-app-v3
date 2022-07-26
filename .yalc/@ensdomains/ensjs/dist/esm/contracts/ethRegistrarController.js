import { ETHRegistrarController__factory } from '../generated/factories/ETHRegistrarController__factory';
export default (provider, address) => ETHRegistrarController__factory.connect(address, provider);
