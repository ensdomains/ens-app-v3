import { useQuery } from 'wagmi'

import { truncateFormat } from '@ensdomains/ensjs/utils/format'

import { ReturnedENS } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
import { getRegistrationStatus } from '@app/utils/registrationStatus'
import { checkETH2LDName, checkETHName, isLabelTooLong, yearsToSeconds } from '@app/utils/utils'

import { useSupportsTLD } from './useSupportsTLD'
import { useValidate } from './useValidate'
import { useWrapperExists } from './useWrapperExists'

type BaseBatchReturn = [ReturnedENS['getOwner'], ReturnedENS['getWrapperData']]
type ETH2LDBatchReturn = [...BaseBatchReturn, ReturnedENS['getExpiry'], ReturnedENS['getPrice']]

export const useBasicName = (name?: string | null, normalised?: boolean) => {
  const ens = useEns()

  const { name: _normalisedName, valid, labelCount } = useValidate(name!, !name)

  const normalisedName = normalised ? name! : _normalisedName

  const { data: supportedTLD, isLoading: supportedTLDLoading } = useSupportsTLD(normalisedName)

  const {
    data: batchData,
    isLoading: batchLoading,
    isFetched,
    internal: { isFetchedAfterMount },
    status,
  } = useQuery(
    ['batch', 'getOwner', 'getExpiry', normalisedName],
    (): Promise<[] | BaseBatchReturn | ETH2LDBatchReturn | undefined> => {
      const labels = normalisedName.split('.')
      const isDotETH = checkETHName(labels)
      if (checkETH2LDName(isDotETH, labels, true)) {
        if (labels[0].length < 3) {
          return Promise.resolve([])
        }
        return ens.batch(
          ens.getOwner.batch(normalisedName),
          ens.getWrapperData.batch(normalisedName),
          ens.getExpiry.batch(normalisedName),
          ens.getPrice.batch(labels[0], yearsToSeconds(1), false),
        )
      }

      return ens.batch(ens.getOwner.batch(normalisedName), ens.getWrapperData.batch(normalisedName))
    },
    {
      enabled: !!(ens.ready && name && valid),
    },
  )

  const [ownerData, wrapperData, expiryData, priceData] = batchData || []

  const registrationStatus = batchData
    ? getRegistrationStatus({
        name: normalisedName,
        ownerData,
        wrapperData,
        expiryData,
        priceData,
        supportedTLD,
      })
    : undefined

  const expiryDate = expiryData?.expiry ? new Date(expiryData.expiry) : undefined

  const gracePeriodEndDate =
    expiryDate && expiryData?.gracePeriod
      ? new Date(expiryDate.getTime() + expiryData.gracePeriod)
      : undefined

  const truncatedName = normalisedName ? truncateFormat(normalisedName) : undefined

  const nameWrapperExists = useWrapperExists()
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'

  const isLoading = !ens.ready || batchLoading || supportedTLDLoading

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
    canBeWrapped:
      nameWrapperExists &&
      !isWrapped &&
      normalisedName?.endsWith('.eth') &&
      !isLabelTooLong(normalisedName),
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
