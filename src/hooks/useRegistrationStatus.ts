import { useEns } from '@app/utils/EnsProvider'
import {
  addRegistrationStatusToBatch,
  getRegistrationStatus,
  RegistrationStatus
} from '@app/utils/registrationStatus'
import { useQuery } from 'wagmi'

export const useRegistrationStatus = (name?: string) => {
  const ens = useEns()

  const {
    data,
    isLoading,
    status,
    isFetched,
    internal: { isFetchedAfterMount },
  } = useQuery(
    ['registrationStatus', name],
    async (): Promise<RegistrationStatus> => {
      const _name = name as string
      return getRegistrationStatus(
        await ens.batch(...addRegistrationStatusToBatch(ens, _name)),
        _name,
      )
    },
    {
      enabled: ens.ready && !!name,
    },
  )

  return {
    data,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
