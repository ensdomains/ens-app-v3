import { Address, parseAbi } from 'viem'
import { useReadContract } from 'wagmi'

import { useControllerLimits } from './useControllerLimits'

/**
 * Returns the NFT gate status for the registration UI.
 * `required`: the controller has `nftGateEnabled === true` and an SMPXNFT address set.
 * `hasNft`:   the connected wallet holds at least one SMPXNFT.
 * `loaded`:   the underlying chain reads have resolved.
 */
export const useNftGateStatus = ({ address }: { address?: Address }) => {
  const { nftGateEnabled, smpxNft } = useControllerLimits()
  const nftAbi = parseAbi(['function balanceOf(address) view returns (uint256)'])
  const required =
    !!nftGateEnabled && !!smpxNft && smpxNft !== '0x0000000000000000000000000000000000000000'

  const { data: balance, isLoading } = useReadContract({
    address: required ? (smpxNft as Address) : undefined,
    abi: nftAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: required && !!address, staleTime: 30_000 },
  })

  return {
    required,
    hasNft: typeof balance === 'bigint' ? balance > 0n : undefined,
    loaded: !required || !address || !isLoading,
    nftAddress: smpxNft,
  }
}
