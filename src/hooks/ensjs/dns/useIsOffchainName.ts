import { useDnsOffchainData } from './useDnsOffchainData'

export const useIsOffchainName = ({
  name,
  enabled,
}: {
  name: string
  enabled?: boolean
}): boolean => {
  const { data: dnsOffchainData } = useDnsOffchainData({
    name,
    enabled,
  })

  return Boolean(dnsOffchainData?.resolverAddress)
}
