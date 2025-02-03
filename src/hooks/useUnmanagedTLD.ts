import { useDnsOffchainStatus } from './dns/useDnsOffchainStatus'
import { useCustomizedTLD } from './useCustomizedTLD'

export const useUnmanagedTLD = (name = '') => {
  const isCustomized = useCustomizedTLD(name)
  const { data: dnsOffchainStatus } = useDnsOffchainStatus({ name })

  if (isCustomized) return true
  if (!dnsOffchainStatus?.resolver?.status) return false
  return (
    dnsOffchainStatus.resolver.status === 'mismatching' &&
    dnsOffchainStatus.resolver.value !== undefined
  )
}
