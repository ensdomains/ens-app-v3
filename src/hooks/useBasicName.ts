import { useQuery } from 'wagmi'

import { truncateFormat } from '@ensdomains/ensjs/utils/format'

import { ReturnedENS } from '@app/types/index'
import { useEns } from '@app/utils/EnsProvider'
import { addRegistrationStatusToBatch, getRegistrationStatus } from '@app/utils/registrationStatus'

import { useValidate } from './useValidate'

export const useBasicName = (name?: string | null, normalised?: boolean) => {
  const ens = useEns()

  const { name: _normalisedName, valid, labelCount } = useValidate(name!, !name)

  const normalisedName = normalised ? name! : _normalisedName

  const {
    data: batchData,
    isLoading: batchLoading,
    isFetched,
    internal: { isFetchedAfterMount },
    status,
  } = useQuery(
    ['batch', 'getOwner', 'getExpiry', normalisedName],
    () => {
      const batchQueries = addRegistrationStatusToBatch(ens, normalisedName)

      if (batchQueries.length > 1) {
        return ens.batch(
          ens.getOwner.batch(normalisedName),
          ens.getWrapperData.batch(normalisedName),
          ...batchQueries,
        )
      }

      return ens.batch(...batchQueries, ens.getWrapperData.batch(normalisedName))
    },
    {
      enabled: !!(ens.ready && name && valid),
    },
  )

  const ownerData = batchData?.[0] as ReturnedENS['getOwner']

  const registrationStatus = batchData
    ? getRegistrationStatus(batchData, normalisedName)
    : undefined

  const wrapperData = batchData?.[1] as ReturnedENS['getWrapperData']

  const expiryData = batchData?.[2] as ReturnedENS['getExpiry']

  const priceData = batchData?.[3] as ReturnedENS['getPrice']

  const expiryDate = expiryData?.expiry ? new Date(expiryData.expiry) : undefined

  const gracePeriodEndDate =
    expiryDate && expiryData?.gracePeriod
      ? new Date(expiryDate.getTime() + expiryData.gracePeriod)
      : undefined

  const truncatedName = normalisedName ? truncateFormat(normalisedName) : undefined

  const isLoading = !ens.ready || batchLoading

  return {
    normalisedName,
    valid,
    labelCount,
    ownerData,
    wrapperData,
    priceData,
    expiryDate,
    gracePeriodEndDate,
    isLoading,
    truncatedName,
    registrationStatus,
    isWrapped: ownerData?.ownershipLevel === 'nameWrapper',
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
