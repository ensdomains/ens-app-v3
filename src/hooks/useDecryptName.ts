import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { checkIsDecrypted } from '@ensdomains/ensjs/utils/labels'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

const useDecryptName = (name: string, skip?: boolean) => {
  const { ready, getDecryptedName } = useEns()

  const nameIsEncrypted = useMemo(() => !checkIsDecrypted(name), [name])

  const {
    data: decryptedName,
    isLoading,
    status,
    isFetched,
    isFetchedAfterMount,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching,
  } = useQuery(
    useQueryKeys().decryptName(name),
    () => getDecryptedName(name, true).then((d) => d || null),
    {
      enabled: !!(!skip && ready && name && nameIsEncrypted),
    },
  )

  return {
    decryptedName,
    isLoading: !ready || isLoading,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}

export default useDecryptName
