import { useMemo } from 'react'
import { useChainId, useConfig } from 'wagmi'

import { getChainName } from '@app/utils/getChainName'

export const useChainName = () => {
  const config = useConfig()
  const chainId = useChainId()

  return useMemo(() => {
    return getChainName(config, { chainId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])
}
