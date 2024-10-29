import { goerli, holesky, localhost, mainnet, sepolia } from 'viem/chains'

export const migrationHelperContract = {
  [mainnet.id]: '0xnot-deployed-yet',
  [localhost.id]: '0xnot-deployed-yet',
  [goerli.id]: '0xwillnotdeploy',
  [holesky.id]: '0x76aafA281Ed5155f83926a12ACB92e237e322A8C',
  [sepolia.id]: '0xf9c8c83adda8d52d9284cdbef23da10b5f9869bf',
} as const
