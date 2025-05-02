import { useChainId } from 'wagmi'

import { DNS_REGISTRAR_ADDRESSES } from '@app/constants/tldData'
import { getTldFromName } from '@app/utils/utils'

import { useOwner } from './ensjs/public/useOwner'
import { useCustomizedTLD } from './useCustomizedTLD'

export const useUnmanagedTLD = (name = '') => {
  const isCustomized = useCustomizedTLD(name)
  const tld = getTldFromName(name)
  const { data: ownerData, isLoading, error } = useOwner({ name: tld })
  const chainId = useChainId()

  if (isCustomized) return true

  if (isLoading || error || !ownerData) return false
  if (ownerData.owner !== DNS_REGISTRAR_ADDRESSES[chainId]) return true
}
