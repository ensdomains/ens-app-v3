import { useMemo } from 'react'
import { useAccount, useQuery } from 'wagmi'

import { truncateFormat } from '@ensdomains/ensjs/utils/format'

import { ReturnedENS } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { emptyAddress } from '@app/utils/constants'
import { getRegistrationStatus } from '@app/utils/registrationStatus'
import { isLabelTooLong, yearsToSeconds } from '@app/utils/utils'

import { usePccExpired } from './fuses/usePccExpired'
import { useContractAddress } from './useContractAddress'
import useRegistrationReducer from './useRegistrationReducer'
import { useSupportsTLD } from './useSupportsTLD'
import { useValidate } from './useValidate'

type BaseBatchReturn = [ReturnedENS['getOwner']]
type NormalBatchReturn = [...BaseBatchReturn, ReturnedENS['getWrapperData']]
type ETH2LDBatchReturn = [...NormalBatchReturn, ReturnedENS['getExpiry'], ReturnedENS['getPrice']]

export const useBasicName = (name?: string | null, normalised?: boolean) => {
  const ens = useEns()
  const { address } = useAccount()

  const { name: _normalisedName, isValid, ...validation } = useValidate(name!, !name)

  const normalisedName = normalised ? name! : _normalisedName

  const selected = { name: normalisedName, address: address! }
  const { item } = useRegistrationReducer(selected)

  const { data: supportedTLD, isLoading: supportedTLDLoading } = useSupportsTLD(normalisedName)

  const {
    data: batchData,
    isLoading: batchLoading,
    isFetched,
    /** DO NOT REMOVE */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching,
    isFetchedAfterMount,
    status,
  } = useQuery(
    useQueryKeys().basicName(normalisedName, item.stepIndex),
    (): Promise<[] | BaseBatchReturn | NormalBatchReturn | ETH2LDBatchReturn | undefined> => {
      // exception for "[root]", get owner of blank name
      if (normalisedName === '[root]') {
        return Promise.all([ens.getOwner('', 'registry')])
      }

      const labels = normalisedName.split('.')
      if (validation.isETH && validation.is2LD) {
        if (validation.isShort) {
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
      enabled: !!(ens.ready && name && isValid),
    },
  )
  const [ownerData, _wrapperData, expiryData, priceData] = batchData || []

  const wrapperData = useMemo(() => {
    if (!_wrapperData) return undefined
    const { expiryDate, ...rest } = _wrapperData
    return {
      ...rest,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    }
  }, [_wrapperData])

  const registrationStatus = batchData
    ? getRegistrationStatus({
        validation,
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

  const nameWrapperAddress = useContractAddress('NameWrapper')
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'
  const canBeWrapped = useMemo(
    () =>
      !!(
        ens.ready &&
        nameWrapperAddress &&
        nameWrapperAddress !== emptyAddress &&
        !isWrapped &&
        normalisedName?.endsWith('.eth') &&
        !isLabelTooLong(normalisedName)
      ),
    [ens.ready, nameWrapperAddress, isWrapped, normalisedName],
  )
  const pccExpired = usePccExpired({ ownerData, wrapperData })

  const isLoading = !ens.ready || batchLoading || supportedTLDLoading

  return {
    ...validation,
    normalisedName,
    isValid,
    ownerData,
    wrapperData,
    priceData,
    expiryDate,
    gracePeriodEndDate,
    isLoading,
    truncatedName,
    registrationStatus,
    isWrapped: ownerData?.ownershipLevel === 'nameWrapper',
    pccExpired,
    canBeWrapped,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
