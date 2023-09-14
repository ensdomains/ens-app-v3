import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { ensNftImageUrl } from '@app/utils/utils'

import { useChainName } from './chain/useChainName'
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
  const chainName = useChainName()
  const registrarAddress = useContractAddress({ contract: 'ensBaseRegistrarImplementation' })

  const queryKeys = useQueryKeys()

  return useQuery(
    queryKeys.getNftImage({ name, registrarAddress, chainName }),
    ({ queryKey: [{ name, chainName, registrarAddress }] }) =>
      fetchImg(ensNftImageUrl({ name: name!, chainName, registrarAddress })),
    {
      enabled: enabled && !!name,
    },
  )
}