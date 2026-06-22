import { useReadContract } from 'wagmi'

import { useContractAddress } from '@app/hooks/chain/useContractAddress'

/**
 * ABI snippet for `BaseRegistrarImplementation.controllers(address) -> bool`.
 *
 * The `controllers` mapping is the on-chain source of truth for whether an
 * ETHRegistrarController is allowed to register/renew names. When the
 * controller is removed via `removeController`, this mapping returns `false`
 * and registration via that controller is effectively disabled.
 *
 * `@ensdomains/ensjs/contracts` does not export a snippet for this mapping,
 * so we declare it inline (same pattern as `useApprovedForAll`).
 */
const baseRegistrarControllersSnippet = [
  {
    inputs: [{ name: '', type: 'address' }],
    name: 'controllers',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

/**
 * Reads `BaseRegistrarImplementation.controllers(ethRegistrarController)`.
 *
 * Returns `data === true`  when the legacy ETH registrar is still authorised
 * (registration enabled) and `data === false` when it has been removed
 * (registration disabled - e.g. after the ENS v2 beta cutover on Sepolia,
 * and eventually on mainnet).
 *
 * Chain-agnostic: the same check works on any chain that has both a
 * BaseRegistrarImplementation and an ETHRegistrarController configured.
 */
export const useIsEthRegistrarControllerActive = () => {
  const baseRegistrarAddress = useContractAddress({
    contract: 'ensBaseRegistrarImplementation',
  })
  const ethRegistrarControllerAddress = useContractAddress({
    contract: 'ensEthRegistrarController',
  })

  return useReadContract({
    abi: baseRegistrarControllersSnippet,
    address: baseRegistrarAddress,
    functionName: 'controllers',
    args: [ethRegistrarControllerAddress],
    query: {
      enabled: !!baseRegistrarAddress && !!ethRegistrarControllerAddress,
    },
  })
}
