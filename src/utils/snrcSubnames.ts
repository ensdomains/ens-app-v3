import { Address, encodePacked, keccak256, namehash, parseAbi } from 'viem'
import { readContract } from 'viem/actions'

import { getSnrcAddresses } from '@app/constants/chains'

const ZERO = '0x0000000000000000000000000000000000000000'

const subnameRegistrarAbi = parseAbi([
  'function childrenLength(bytes32) view returns (uint256)',
  'function getChildren(bytes32 parentNode, uint256 start, uint256 count) view returns (bytes32[] hashes, string[] labels)',
  'function ownerOf(uint256 node) view returns (address)',
])

export type SnrcSubname = {
  node: `0x${string}`
  labelhash: `0x${string}`
  label: string
  name: string
  owner: Address
}

/**
 * On-chain subname enumeration for a parent name, replacing the subgraph. Reads
 * `SubnameRegistrar.getChildren` (labelhash + plaintext label, indexed on-chain)
 * plus each child's effective owner via `ownerOf` (the 2LD NFT holder — subnames
 * are soulbound to the NFT). Drops entries with owner == 0, i.e. deleted, purged,
 * or generation-dead (left over after the 2LD was re-registered). SNRC subname
 * sets are small, so a single `getChildren` call covers them.
 */
export const getSnrcSubnames = async (
  client: any,
  chainId: number,
  parentName: string,
): Promise<SnrcSubname[]> => {
  const addresses = getSnrcAddresses(chainId)
  const registrar = addresses.SubnameRegistrar as Address | undefined
  if (!registrar || registrar === ZERO) return []

  const parentNode = namehash(parentName)
  const len = (await readContract(client, {
    address: registrar,
    abi: subnameRegistrarAbi,
    functionName: 'childrenLength',
    args: [parentNode],
  })) as bigint
  if (len === 0n) return []

  const [hashes, labels] = (await readContract(client, {
    address: registrar,
    abi: subnameRegistrarAbi,
    functionName: 'getChildren',
    args: [parentNode, 0n, len],
  })) as [readonly `0x${string}`[], readonly string[]]

  const items = await Promise.all(
    hashes.map(async (labelhash, i) => {
      const node = keccak256(encodePacked(['bytes32', 'bytes32'], [parentNode, labelhash]))
      let owner = ZERO as Address
      try {
        owner = (await readContract(client, {
          address: registrar,
          abi: subnameRegistrarAbi,
          functionName: 'ownerOf',
          args: [BigInt(node)],
        })) as Address
      } catch {
        /* dead / purged / untracked */
      }
      return {
        node,
        labelhash,
        label: labels[i],
        name: `${labels[i]}.${parentName}`,
        owner,
      }
    }),
  )
  return items.filter((it) => it.owner.toLowerCase() !== ZERO)
}
