import { holesky } from 'viem/chains'
import { goerli, localhost, mainnet, sepolia } from 'wagmi/chains'

import { addEnsContracts } from '@ensdomains/ensjs'

import type { Register } from '@app/local-contracts'
import { makeLocalhostChainWithEns } from '@app/utils/chains/makeLocalhostChainWithEns'

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const localhostWithEns = makeLocalhostChainWithEns(localhost, deploymentAddresses)
export const mainnetWithEns = addEnsContracts(mainnet)
export const goerliWithEns = addEnsContracts(goerli)
export const sepoliaWithEns = addEnsContracts(sepolia)
export const holeskyWithEns = addEnsContracts(holesky)

export const chainsWithEns = [
  mainnetWithEns,
  goerliWithEns,
  sepoliaWithEns,
  holeskyWithEns,
  localhostWithEns,
] as const

export const getSupportedChainById = (chainId: number | undefined) =>
  chainId ? chainsWithEns.find((c) => c.id === chainId) : undefined

export type SupportedChain =
  | typeof mainnetWithEns
  | typeof goerliWithEns
  | typeof sepoliaWithEns
  | typeof holeskyWithEns
  | typeof localhostWithEns
