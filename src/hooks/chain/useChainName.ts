import { useMemo } from 'react'
import { useChainId } from 'wagmi'

import { getChainName } from '@app/utils/getChainName'

export const useChainName = () => {
  const chainId = useChainId()

  return useMemo(() => {
    return getChainName(chainId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])
}
