import { useMemo } from 'react'
import { useChainId, useConfig } from 'wagmi'

type BlockExplorerRoute = 'tx' | 'address' | 'nft'

type BlockExplorer = {
  name: string
  url: string
}

type UseBlockExplorerReturnType = {
  blockExplorer: BlockExplorer | undefined
  buildUrl: (data: string, route?: BlockExplorerRoute) => string | undefined
  buildTransactionUrl: (hash: string) => string | undefined
  buildAddressUrl: (address: string) => string | undefined
  buildNftUrl: (contractAddress: string, tokenId: string) => string | undefined
}

export const useBlockExplorer = (): UseBlockExplorerReturnType => {
  const config = useConfig()
  const chainId = useChainId()

  return useMemo(() => {
    const { chain } = config.getClient({ chainId })
    const blockExplorer = chain.blockExplorers?.default

    const buildUrl = (data: string, route: BlockExplorerRoute = 'tx'): string | undefined => {
      if (!blockExplorer) return undefined
      return `${blockExplorer.url}/${route}/${data}`
    }

    const buildTransactionUrl = (hash: string): string | undefined => {
      return buildUrl(hash, 'tx')
    }

    const buildAddressUrl = (address: string): string | undefined => {
      return buildUrl(address, 'address')
    }

    const buildNftUrl = (contractAddress: string, tokenId: string): string | undefined => {
      if (!blockExplorer) return undefined
      return `${blockExplorer.url}/nft/${contractAddress}/${tokenId}`
    }

    return {
      blockExplorer,
      buildUrl,
      buildTransactionUrl,
      buildAddressUrl,
      buildNftUrl,
    }
  }, [config, chainId])
}
