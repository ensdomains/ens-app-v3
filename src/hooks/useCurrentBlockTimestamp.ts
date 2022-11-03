import { useQuery } from '@tanstack/react-query'
import { useProvider } from '@web3modal/react'

import { useInvalidateOnBlock } from './useInvalidateOnBlock'

const useCurrentBlockTimestamp = () => {
  const { provider } = useProvider()
  const { data } = useQuery(['currentBlockTimestamp'], async () => {
    const { timestamp } = await provider!.getBlock('latest')
    return timestamp
  })

  useInvalidateOnBlock({
    enabled: true,
    queryKey: ['currentBlockTimestamp'],
  })

  return data
}

export default useCurrentBlockTimestamp
