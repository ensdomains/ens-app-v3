import { useQuery } from '@tanstack/react-query'

import { useEns } from '@app/utils/EnsProvider'
import {
  RegistrationStatus,
  addRegistrationStatusToBatch,
  getRegistrationStatus,
} from '@app/utils/registrationStatus'

export const useRegistrationStatus = (name?: string) => {
  const ens = useEns()

  const { data, isLoading, status, isFetched } = useQuery(
    ['registrationStatus', name],
    async (): Promise<RegistrationStatus> => {
      const _name = name as string
      const batchQueries = addRegistrationStatusToBatch(ens, _name)
      return getRegistrationStatus(
        batchQueries.length ? await ens.batch(...addRegistrationStatusToBatch(ens, _name)) : [],
        _name,
      )
    },
    {
      enabled: ens.ready && !!name,
      cacheTime: 0,
    },
  )

  return {
    data,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched,
  }
}
