import { Address } from 'viem'
import { useChainId, useReadContracts } from 'wagmi'

import { getSnrcAddresses } from '@app/constants/chains'

const controllerAbi = [
  {
    inputs: [],
    name: 'minCharLength',
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nftGateEnabled',
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'smpxNft',
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const useControllerLimits = () => {
  const chainId = useChainId()
  const controllerAddress = getSnrcAddresses(chainId).ETHRegistrarController as Address | undefined
  const enabled = !!controllerAddress && controllerAddress !== '0x0000000000000000000000000000000000000000'
  // Some test fixtures mock the whole `wagmi` module without including
  // `useReadContracts`, leaving the hook undefined at call time. Coalesce
  // so destructuring `data` doesn't blow up render. Real callers see the
  // hook return its full object as usual.
  const result = useReadContracts({
    contracts: enabled
      ? [
          { address: controllerAddress!, abi: controllerAbi, functionName: 'minCharLength' },
          { address: controllerAddress!, abi: controllerAbi, functionName: 'nftGateEnabled' },
          { address: controllerAddress!, abi: controllerAbi, functionName: 'smpxNft' },
        ]
      : [],
    query: { enabled, staleTime: 60_000 },
  })
  const data = result?.data

  return {
    minCharLength: data?.[0]?.status === 'success' ? Number(data[0].result as number) : undefined,
    nftGateEnabled: data?.[1]?.status === 'success' ? (data[1].result as boolean) : undefined,
    smpxNft: data?.[2]?.status === 'success' ? (data[2].result as Address) : undefined,
  }
}
