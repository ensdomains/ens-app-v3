import { useEns } from '@app/utils/EnsProvider'
import { ensNftImageUrl, imageUrlUnknownRecord } from '@app/utils/utils'
import { useQuery } from 'react-query'

export const useAvatar = (name: string | undefined, network: number) => {
  const avatar = name ? imageUrlUnknownRecord(name, network) : undefined

  return avatar
}

export const useNFTImage = (name: string | undefined, network: number) => {
  const isCompatible = !!(
    name &&
    name.split('.').length === 2 &&
    name.endsWith('.eth')
  )
  const { ready, contracts } = useEns()
  const { data: baseRegistrarAddress } = useQuery(
    'base-registrar-address',
    () => contracts?.getBaseRegistrar()!.then((c) => c.address),
    {
      enabled: ready && !!name,
      staleTime: 60000,
    },
  )

  const image =
    name && baseRegistrarAddress
      ? ensNftImageUrl(name, network, baseRegistrarAddress)
      : undefined

  return { image, isCompatible }
}
