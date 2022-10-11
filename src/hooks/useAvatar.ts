import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { ensNftImageUrl, imageUrlUnknownRecord } from '@app/utils/utils'

const fetchImg = async (url: string) =>
  new Promise<string | undefined>((resolve) => {
    const img = new Image()
    img.src = url

    const handleLoad = () => {
      img.removeEventListener('load', handleLoad)
      if (!img.complete) {
        resolve(undefined)
        return
      }
      if (!img.naturalWidth) {
        resolve(undefined)
        return
      }
      resolve(img.src)
    }

    img.addEventListener('load', handleLoad)
  })

export const useAvatar = (name: string | undefined, network: number) => {
  const { data, isLoading, status } = useQuery(
    ['getAvatar', name, network],
    () => fetchImg(imageUrlUnknownRecord(name!, network)),
    {
      enabled: !!name,
      cacheTime: 600,
      staleTime: 60000,
    },
  )

  return { avatar: data, isLoading, status }
}

export const useNFTImage = (name: string | undefined, network: number) => {
  const isCompatible = !!(name && name.split('.').length === 2)
  const { ready, contracts } = useEns()
  const { data: baseRegistrarAddress } = useQuery(
    ['base-registrar-address'],
    () => contracts?.getBaseRegistrar()!.then((c) => c.address),
    {
      enabled: ready && !!name,
      staleTime: 60000,
    },
  )
  const { data, isLoading, status } = useQuery(
    ['getNFTImage', name],
    () => fetchImg(ensNftImageUrl(name!, network, baseRegistrarAddress!)),
    {
      enabled: ready && !!name && !!baseRegistrarAddress && isCompatible,
    },
  )

  return { image: data, isLoading, status, isCompatible }
}
