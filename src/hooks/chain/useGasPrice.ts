import { useMemo } from 'react'
import { useChainId, useGasPrice as useWagmiGasPrice } from 'wagmi'
import { getGasPriceQueryKey } from 'wagmi/query'

import { useInvalidateOnBlock } from './useInvalidateOnBlock'

const gasPriceBlockInterval = 2n // get gas price every two blocks

export const useGasPrice = () => {
  const query = useWagmiGasPrice()

  const chainId = useChainId()
  const queryKey = useMemo(() => getGasPriceQueryKey({ chainId }), [chainId])
  useInvalidateOnBlock({
    queryKey,
    blockInterval: gasPriceBlockInterval,
  })

  return query
}
