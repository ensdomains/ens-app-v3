/* eslint-disable import/no-extraneous-dependencies */
import { Address, encodeFunctionData, namehash, parseAbi } from 'viem'

import { registryResolverSnippet } from '@ensdomains/ensjs/contracts'
import { setPrimaryName, setResolver } from '@ensdomains/ensjs/wallet'

import { Accounts, User } from './accounts'
import {
  deploymentAddresses,
  publicClient,
  walletClient,
  waitForTransaction,
} from './contracts/utils/addTestContracts'

// ABI for the DefaultReverseRegistrar contract
const defaultReverseRegistrarAbi = parseAbi([
  'function setName(string name) external returns (bytes32)',
  'function nameForAddr(address addr) external view returns (string)',
])

// ABI for resolver name() function
const resolverNameSnippet = parseAbi([
  'function name(bytes32 node) external view returns (string)',
])

// Helper to get the reverse node for an address (e.g., "0x1234...abcd.addr.reverse")
const getReverseNode = (address: Address): string =>
  `${address.toLowerCase().slice(2)}.addr.reverse`

type PrimaryNameState = {
  l1?: string // Name to set in L1 registry ('' to clear, undefined to skip)
  default?: string // Name to set in default registry ('' to clear, undefined to skip)
}

type SetPrimaryNameStateParams = {
  user: User
  state: PrimaryNameState
}

type GetPrimaryNameStateResult = {
  l1: string | null
  default: string | null
}

/**
 * Sets the primary name state for a user in both L1 and default registries.
 *
 * @example
 * // Set only L1 primary name
 * await setPrimaryNameState(accounts, { user: 'user', state: { l1: 'myname.eth' } })
 *
 * // Set only default primary name
 * await setPrimaryNameState(accounts, { user: 'user', state: { default: 'myname.eth' } })
 *
 * // Set both registries
 * await setPrimaryNameState(accounts, { user: 'user', state: { l1: 'myname.eth', default: 'myname.eth' } })
 *
 * // Clear L1, set default
 * await setPrimaryNameState(accounts, { user: 'user', state: { l1: '', default: 'myname.eth' } })
 *
 * // Clear both registries
 * await setPrimaryNameState(accounts, { user: 'user', state: { l1: '', default: '' } })
 */
export async function setPrimaryNameState(
  accounts: Accounts,
  { user, state }: SetPrimaryNameStateParams,
): Promise<void> {
  const address = accounts.getAddress(user) as Address
  const account = accounts.getAccountForUser(user)

  // Set L1 primary name if specified
  if (state.l1 !== undefined) {
    if (state.l1 === '') {
      // To clear L1 primary name, set the resolver for the reverse node to zero address
      const functionData = setResolver.makeFunctionData(walletClient, {
        name: getReverseNode(address),
        contract: 'registry',
        resolverAddress: '0x0000000000000000000000000000000000000000',
      })
      const tx = await walletClient.sendTransaction({
        account,
        ...functionData,
      })
      await waitForTransaction(tx)
    } else {
      // Set the primary name
      const functionData = setPrimaryName.makeFunctionData(walletClient, {
        name: state.l1,
      })
      const tx = await walletClient.sendTransaction({
        account,
        ...functionData,
      })
      await waitForTransaction(tx)
    }
  }

  // Set default primary name if specified
  if (state.default !== undefined) {
    const tx = await walletClient.sendTransaction({
      account,
      to: deploymentAddresses.DefaultReverseRegistrar as Address,
      data: encodeFunctionData({
        abi: defaultReverseRegistrarAbi,
        functionName: 'setName',
        args: [state.default],
      }),
    })
    await waitForTransaction(tx)
  }
}

/**
 * Gets the current primary name state for a user from both registries.
 */
export async function getPrimaryNameState(
  accounts: Accounts,
  user: User,
): Promise<GetPrimaryNameStateResult> {
  const address = accounts.getAddress(user) as Address
  const reverseNode = getReverseNode(address)
  const reverseNodeHash = namehash(reverseNode)

  // Get L1 reverse registry name by querying the registry and resolver directly
  let l1Name: string | null = null
  try {
    // First, get the resolver for the reverse node from the ENS Registry
    const resolverAddress = await publicClient.readContract({
      address: deploymentAddresses.ENSRegistry as Address,
      abi: registryResolverSnippet,
      functionName: 'resolver',
      args: [reverseNodeHash],
    })

    // If there's a resolver set, query the name from it
    if (resolverAddress && resolverAddress !== '0x0000000000000000000000000000000000000000') {
      const name = await publicClient.readContract({
        address: resolverAddress,
        abi: resolverNameSnippet,
        functionName: 'name',
        args: [reverseNodeHash],
      })
      l1Name = name || null
    }
  } catch {
    l1Name = null
  }

  // Get default reverse registry name
  let defaultName: string | null = null
  try {
    const result = await publicClient.readContract({
      address: deploymentAddresses.DefaultReverseRegistrar as Address,
      abi: defaultReverseRegistrarAbi,
      functionName: 'nameForAddr',
      args: [address],
    })
    defaultName = result || null
  } catch {
    defaultName = null
  }

  return { l1: l1Name, default: defaultName }
}

/**
 * Clears all primary names for a user (both L1 and default).
 */
export async function clearAllPrimaryNames(accounts: Accounts, user: User): Promise<void> {
  await setPrimaryNameState(accounts, {
    user,
    state: { l1: '', default: '' },
  })
}

export type { PrimaryNameState, SetPrimaryNameStateParams, GetPrimaryNameStateResult }
