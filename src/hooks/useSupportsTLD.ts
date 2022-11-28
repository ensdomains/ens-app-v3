import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

export const useSupportsTLD = (name = '') => {
  const { ready, supportsTLD } = useEns()
  const labels = name?.split('.') || []
  const tld = labels[labels.length - 1]
  return useQuery(['supportedTLD', tld], () => supportsTLD(tld), {
    enabled: ready && !!tld,
  })
}
