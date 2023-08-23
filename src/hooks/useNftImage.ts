import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { ensNftImageUrl } from '@app/utils/utils'

import { useContractAddress } from './chain/useContractAddress'

type UseNftImageParameters = {
  name: string | undefined
  enabled?: boolean
}

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

export const useNftImage = ({ name, enabled = true }: UseNftImageParameters) => {
  const registrarAddress = useContractAddress({ contract: 'ensBaseRegistrarImplementation' })

  const queryKeys = useQueryKeys()

  return useQuery(
    queryKeys.getNftImage({ name, registrarAddress }),
    ({ queryKey: [{ chainId, name, registrarAddress }] }) => fetchImg(ensNftImageUrl(name!, chainId, registrarAddress)),
    {
      enabled: enabled && !!name,
    },
  )
}
