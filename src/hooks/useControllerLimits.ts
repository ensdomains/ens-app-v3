import { Address } from 'viem'
import { useReadContracts } from 'wagmi'

import { deploymentAddresses } from '@app/constants/chains'

const controllerAddress = deploymentAddresses.ETHRegistrarController as Address | undefined

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
  const enabled = !!controllerAddress && controllerAddress !== '0x0000000000000000000000000000000000000000'
  const { data } = useReadContracts({
    contracts: enabled
      ? [
          { address: controllerAddress!, abi: controllerAbi, functionName: 'minCharLength' },
          { address: controllerAddress!, abi: controllerAbi, functionName: 'nftGateEnabled' },
          { address: controllerAddress!, abi: controllerAbi, functionName: 'smpxNft' },
        ]
      : [],
    query: { enabled, staleTime: 60_000 },
  })

  return {
    minCharLength: data?.[0]?.status === 'success' ? Number(data[0].result as number) : undefined,
    nftGateEnabled: data?.[1]?.status === 'success' ? (data[1].result as boolean) : undefined,
    smpxNft: data?.[2]?.status === 'success' ? (data[2].result as Address) : undefined,
  }
}
