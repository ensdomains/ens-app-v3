import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { ensNftImageUrl, imageUrlUnknownRecord } from '@app/utils/utils'

import { useContractAddress } from './useContractAddress'

const fetchImg = async (url: string) =>
  new Promise<string | null>((resolve) => {
    const img = new Image()
    img.src = url

    const handleLoad = () => {
      img.removeEventListener('load', handleLoad)
      if (!img.complete) {
        resolve(null)
        return
      }
      if (!img.naturalWidth) {
        resolve(null)
        return
      }
      resolve(img.src)
    }

    const handleError = () => {
      img.removeEventListener('error', handleError)
      resolve(null)
    }

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)
  })

export const useAvatar = (name: string | null | undefined, network: number, noCache?: boolean) => {
  const { data, isLoading, status } = useQuery(
    useQueryKeys().avatar.avatar(name),
    () => fetchImg(imageUrlUnknownRecord(name!, network)),
    {
      enabled: !!name,
      cacheTime: noCache ? 0 : 60000,
      staleTime: 60000,
      refetchOnMount: false,
    },
  )

  return { avatar: data, isLoading, status }
}

export const useNFTImage = (name: string | undefined, network: number) => {
  const isCompatible = !!(name && name.split('.').length === 2)
  const { ready } = useEns()
  const baseRegistrarAddress = useContractAddress('BaseRegistrarImplementation')

  const { data, isLoading, status } = useQuery(
    useQueryKeys().avatar.getNFTImage(name),
    () => fetchImg(ensNftImageUrl(name!, network, baseRegistrarAddress!)),
    {
      enabled: ready && !!name && !!baseRegistrarAddress && isCompatible,
    },
  )

  return { image: data, isLoading, status, isCompatible }
}
