import { useDnsOffchainStatus } from './dns/useDnsOffchainStatus'
import { useCustomizedTLD } from './useCustomizedTLD'

export const useUnmanagedTLD = (name = '') => {
  const isCustomized = useCustomizedTLD(name)
  const { data: dnsOffchainStatus } = useDnsOffchainStatus({ name })

  return isCustomized || (dnsOffchainStatus?.resolver?.status === 'mismatching')
}
