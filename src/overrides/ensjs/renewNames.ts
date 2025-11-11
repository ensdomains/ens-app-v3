import { encodeFunctionData, type Account, type Hex, type Transport } from 'viem'

import type { ChainWithEns, ClientWithAccount } from '@ensdomains/ensjs/contracts'
import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'

/**
 * Override for ENS.js renewNames to handle:
 * 1. Wrapped names - route to temporary wrapped name registrar controller
 * 2. Bulk renewals - use legacy bulk renewal contract (omit referrer)
 *
 * This override should be removed once ENS contracts v1.6.0 are fully deployed
 * and the standard renewNames function supports these cases.
 */

// ABI for wrapped name renewal (same as standard ETHRegistrarController)
const wrappedNameRenewalAbi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'label',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'referrer',
        type: 'bytes32',
      },
    ],
    name: 'renew',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// ABI for legacy bulk renewal (without referrer support)
const legacyBulkRenewalAbi = [
  {
    inputs: [
      {
        internalType: 'string[]',
        name: 'names',
        type: 'string[]',
      },
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
    ],
    name: 'renewAll',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// ABI for single name renewal (standard ETHRegistrarController)
const singleNameRenewalAbi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'label',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'referrer',
        type: 'bytes32',
      },
    ],
    name: 'renew',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

export type RenewNamesDataParameters = {
  /** Name or names to renew */
  nameOrNames: string | string[]
  /** Duration to renew name(s) for */
  duration: bigint | number
  /** Referrer data (omitted for bulk renewals) */
  referrer?: Hex
  /** Value of all renewals */
  value: bigint
  /** Whether the name(s) are wrapped (only applies to single names) */
  hasWrapped?: boolean
  /** Contract address for wrapped name renewals (optional override) */
  wrappedRenewalContract?: `0x${string}`
}

export type RenewNamesDataReturnType = {
  to: `0x${string}`
  data: Hex
  value: bigint
}

export const makeFunctionData = <TChain extends ChainWithEns, TAccount extends Account | undefined>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  {
    nameOrNames,
    duration,
    referrer = EMPTY_BYTES32,
    value,
    hasWrapped = false,
    wrappedRenewalContract,
  }: RenewNamesDataParameters,
): RenewNamesDataReturnType => {
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]
  const labels = names.map((name) => name.split('.')[0])

  // Case 1: Single wrapped name - route to wrapped name registrar controller
  if (hasWrapped && names.length === 1) {
    // Get the contract address from chain config or use provided override
    // The contract name 'universalRegistrarRenewalWithReferrer' is registered in chain config
    let contractAddress = wrappedRenewalContract

    if (!contractAddress) {
      try {
        // Try to get from chain contracts if available
        contractAddress = (wallet.chain?.contracts as any)?.universalRegistrarRenewalWithReferrer
          ?.address
      } catch {
        // Fallback to hardcoded address if not in chain config
        // This address should match the deployed UniversalRegistrarRenewalWithReferrer
        contractAddress = '0xdbC43Ba45381e02825b14322cDdd15eC4B3164E6'
      }
    }

    if (!contractAddress) {
      throw new Error(
        'No contract address found for wrapped name renewal. Please provide wrappedRenewalContract parameter.',
      )
    }

    return {
      to: contractAddress,
      data: encodeFunctionData({
        abi: wrappedNameRenewalAbi,
        functionName: 'renew',
        args: [labels[0], BigInt(duration), referrer],
      }),
      value,
    }
  }

  // Case 2: Bulk renewal - use legacy bulk renewal contract (no referrer support)
  if (labels.length > 1) {
    return {
      to: getChainContractAddress({
        client: wallet,
        contract: 'ensBulkRenewal',
      }),
      data: encodeFunctionData({
        abi: legacyBulkRenewalAbi,
        functionName: 'renewAll',
        args: [labels, BigInt(duration)],
      }),
      value,
    }
  }

  // Case 3: Single unwrapped name - use standard ETHRegistrarController with referrer
  return {
    to: getChainContractAddress({
      client: wallet,
      contract: 'ensEthRegistrarController',
    }),
    data: encodeFunctionData({
      abi: singleNameRenewalAbi,
      functionName: 'renew',
      args: [labels[0], BigInt(duration), referrer],
    }),
    value,
  }
}

/**
 * Namespace pattern matching ENS.js structure
 * Allows calling renewNames.makeFunctionData(...)
 */
const renewNames = {
  makeFunctionData,
}

export default renewNames
