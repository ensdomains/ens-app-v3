import { Address, parseAbi } from 'viem'
import { useChainId, useReadContract } from 'wagmi'

import { getSnrcAddresses } from '@app/constants/chains'

import { useContractAddress } from './chain/useContractAddress'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const isApprovedForAllAbi = parseAbi([
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
])

/**
 * SNRC subnames are created and indexed by the immutable `SubnameRegistrar`,
 * which requires the parent owner to have approved it as a registry-wide
 * operator (`ens.setApprovalForAll(subnameRegistrar, true)`). Returns the
 * registrar address and whether `address` has already granted that approval, so
 * the create flow can prepend an approval transaction when needed.
 */
export const useSubnameRegistrarApproval = ({
  address,
  enabled = true,
}: {
  address?: Address
  enabled?: boolean
}) => {
  const chainId = useChainId()
  const registry = useContractAddress({ contract: 'ensRegistry' })
  const subnameRegistrar = getSnrcAddresses(chainId).SubnameRegistrar as Address | undefined
  const ready = !!subnameRegistrar && subnameRegistrar !== ZERO_ADDRESS && !!registry && !!address

  const { data: approved, isLoading } = useReadContract({
    abi: isApprovedForAllAbi,
    address: ready ? registry : undefined,
    functionName: 'isApprovedForAll',
    args: address && subnameRegistrar ? [address, subnameRegistrar] : undefined,
    query: { enabled: enabled && ready },
  })

  return { subnameRegistrar, approved: approved === true, isLoading, ready }
}
