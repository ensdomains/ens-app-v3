import { useEns } from '@app/utils/EnsProvider'
import { ensNftImageUrl, imageUrlUnknownRecord } from '@app/utils/utils'
import { useQuery } from 'react-query'

const fetchImg = async (url: string) => {
  const response = await fetch(url)
  const imgBlob = response && (await response.blob())
  const src = URL.createObjectURL(imgBlob)
  if (imgBlob?.type.startsWith('image/')) {
    return src
  }
  return undefined
}

export const useAvatar = (name: string | undefined, network: string) => {
  const { data, isLoading, status } = useQuery(
    ['getAvatar', name],
    () => fetchImg(imageUrlUnknownRecord(name!, network)),
    {
      enabled: !!name,
    },
  )

  return { avatar: data, isLoading, status }
}

export const useNFTImage = (name: string | undefined, network: string) => {
  const { ready, contracts } = useEns()
  const { data: baseRegistrarAddress } = useQuery(
    'base-registrar-address',
    () => contracts?.getBaseRegistrar()!.then((c) => c.address),
    {
      enabled: ready && !!name,
    },
  )
  const { data, isLoading, status } = useQuery(
    ['getNFTImage', name],
    () => fetchImg(ensNftImageUrl(name!, network, baseRegistrarAddress!)),
    {
      enabled: ready && !!name && !!baseRegistrarAddress,
    },
  )

  return { image: data, isLoading, status }
}
