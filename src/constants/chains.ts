import { luksoTestnet } from 'wagmi/chains'

import { addEnsContracts } from '@ensdomains/ensjs'

import type { Register } from '@app/local-contracts'
import { makeLocalhostChainWithEns } from '@app/utils/chains/makeLocalhostChainWithEns'

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const localhostWithEns = makeLocalhostChainWithEns<typeof luksoTestnet>(
  luksoTestnet,
  deploymentAddresses,
)

export const luksoTestnetWithEns = addEnsContracts(luksoTestnet)

export const chainsWithEns = [localhostWithEns, luksoTestnetWithEns] as const

export const getSupportedChainById = (chainId: number | undefined) =>
  chainId ? chainsWithEns.find((c) => c.id === chainId) : undefined

export type SupportedChain = typeof localhostWithEns | typeof luksoTestnetWithEns
