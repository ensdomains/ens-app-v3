import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { checkIsDecrypted } from '@ensdomains/ensjs/utils/labels'

import { useEns } from '@app/utils/EnsProvider'

const useDecryptName = (name: string, skip?: boolean) => {
  const { ready, getDecryptedName } = useEns()

  const nameIsEncrypted = useMemo(() => !checkIsDecrypted(name), [name])

  const {
    data: decryptedName,
    isLoading,
    status,
    isFetched,
    internal: { isFetchedAfterMount },
  } = useQuery(['graph', 'decryptName', name], () => getDecryptedName(name, true), {
    enabled: !!(!skip && ready && name && nameIsEncrypted),
  })

  return {
    decryptedName,
    isLoading: !ready || isLoading,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}

export default useDecryptName
