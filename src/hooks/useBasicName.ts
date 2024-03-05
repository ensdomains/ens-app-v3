import { useMemo } from 'react'

import { truncateFormat } from '@ensdomains/ensjs/utils'

import { getRegistrationStatus } from '@app/utils/registrationStatus'
import { isLabelTooLong, yearsToSeconds } from '@app/utils/utils'

import { useContractAddress } from './chain/useContractAddress'
import useCurrentBlockTimestamp from './chain/useCurrentBlockTimestamp'
import { useAddressRecord } from './ensjs/public/useAddressRecord'
import { useExpiry } from './ensjs/public/useExpiry'
import { useOwner } from './ensjs/public/useOwner'
import { usePrice } from './ensjs/public/usePrice'
import { useWrapperData } from './ensjs/public/useWrapperData'
import { usePccExpired } from './fuses/usePccExpired'
import { useSupportsTLD } from './useSupportsTLD'
import { useValidate } from './useValidate'

const EXPIRY_LIVE_WATCH_TIME = 1_000 * 60 * 5 // 5 minutes

type UseBasicNameOptions = {
  name?: string | null
  normalised?: boolean
  enabled?: boolean
}

export const useBasicName = ({ name, normalised = false, enabled = true }: UseBasicNameOptions) => {
  const validation = useValidate({ input: name!, enabled: enabled && !!name })

  const { name: _normalisedName, isValid, isShort, isETH, is2LD } = validation

  const normalisedName = normalised ? name! : _normalisedName

  const { data: supportedTLD, isLoading: supportedTLDLoading } = useSupportsTLD(normalisedName)

  const commonEnabled = enabled && !!name && isValid && !isShort
  const isRoot = name === '[root]'

  const {
    data: ownerData,
    isLoading: isOwnerLoading,
    isCachedData: isOwnerCachedData,
    refetchIfEnabled: refetchOwner,
  } = useOwner({ name: normalisedName, enabled: commonEnabled })
  const {
    data: wrapperData,
    isLoading: isWrapperDataLoading,
    isCachedData: isWrapperDataCachedData,
    refetchIfEnabled: refetchWrapperData,
  } = useWrapperData({ name: normalisedName, enabled: commonEnabled && !isRoot })
  const {
    data: expiryData,
    isLoading: isExpiryLoading,
    isCachedData: isExpiryCachedData,
    refetchIfEnabled: refetchExpiry,
  } = useExpiry({ name: normalisedName, enabled: commonEnabled && !isRoot && isETH && is2LD })
  const {
    data: priceData,
    isLoading: isPriceLoading,
    isCachedData: isPriceCachedData,
    refetchIfEnabled: refetchPrice,
  } = usePrice({
    nameOrNames: normalisedName,
    duration: yearsToSeconds(1),
    enabled: commonEnabled && !isRoot && isETH && is2LD,
  })
  const {
    data: addrData,
    isLoading: isAddrLoading,
    isCachedData: isAddrCachedData,
    refetchIfEnabled: refetchAddr,
  } = useAddressRecord({
    name: normalisedName,
    enabled: commonEnabled && !isRoot && !isETH,
  })

  const publicCallsLoading =
    isOwnerLoading || isWrapperDataLoading || isExpiryLoading || isPriceLoading || isAddrLoading
  const publicCallsCachedData =
    isOwnerCachedData ||
    isWrapperDataCachedData ||
    isExpiryCachedData ||
    isPriceCachedData ||
    isAddrCachedData

  const expiryDate = expiryData?.expiry?.date

  const gracePeriodEndDate =
    expiryDate && expiryData?.gracePeriod
      ? new Date(expiryDate.getTime() + expiryData.gracePeriod * 1000)
      : undefined

  // gracePeriodEndDate is +/- 5 minutes from Date.now()
  const isTempPremiumDesynced = !!(
    gracePeriodEndDate &&
    Date.now() + EXPIRY_LIVE_WATCH_TIME > gracePeriodEndDate.getTime() &&
    gracePeriodEndDate.getTime() > Date.now() - EXPIRY_LIVE_WATCH_TIME
  )

  const blockTimestamp = useCurrentBlockTimestamp({ enabled: isTempPremiumDesynced })

  const registrationStatusTimestamp = useMemo(() => {
    if (!isTempPremiumDesynced) return Date.now()
    if (blockTimestamp) return Number(blockTimestamp) * 1000
    return Date.now() - EXPIRY_LIVE_WATCH_TIME
  }, [isTempPremiumDesynced, blockTimestamp])

  const registrationStatus = !publicCallsLoading
    ? getRegistrationStatus({
        timestamp: registrationStatusTimestamp,
        validation,
        ownerData,
        wrapperData,
        expiryData,
        priceData,
        addrData,
        supportedTLD,
      })
    : undefined

  const truncatedName = normalisedName ? truncateFormat(normalisedName) : undefined

  const nameWrapperAddress = useContractAddress({ contract: 'ensNameWrapper' })
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'
  const canBeWrapped = useMemo(
    () =>
      !!(
        nameWrapperAddress &&
        !isWrapped &&
        normalisedName?.endsWith('.eth') &&
        !isLabelTooLong(normalisedName)
      ),
    [nameWrapperAddress, isWrapped, normalisedName],
  )
  const pccExpired = usePccExpired({ ownerData, wrapperData })

  const isLoading = publicCallsLoading || supportedTLDLoading

  return {
    ...validation,
    normalisedName,
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
    isCachedData: publicCallsCachedData,
    refetchIfEnabled: () => {
      refetchOwner()
      refetchWrapperData()
      refetchExpiry()
      refetchPrice()
      refetchAddr()
    },
  }
}
