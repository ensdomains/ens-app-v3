import { useMemo } from 'react'
import { getAddress } from 'viem'

import { truncateFormat } from '@ensdomains/ensjs/utils'

import { getRegistrationStatus } from '@app/utils/registrationStatus'
import { isLabelTooLong, yearsToSeconds } from '@app/utils/utils'

import { useContractAddress } from './chain/useContractAddress'
import useCurrentBlockTimestamp from './chain/useCurrentBlockTimestamp'
import { useAddressRecord } from './ensjs/public/useAddressRecord'
import { useExpiry } from './ensjs/public/useExpiry'
import { useOwner, UseOwnerReturnType } from './ensjs/public/useOwner'
import { usePrice } from './ensjs/public/usePrice'
import { useWrapperData } from './ensjs/public/useWrapperData'
import { useSubgraphRegistrant } from './ensjs/subgraph/useSubgraphRegistrant'
import { usePccExpired } from './fuses/usePccExpired'
import { useSupportsTLD } from './useSupportsTLD'
import { useValidate } from './useValidate'

const EXPIRY_LIVE_WATCH_TIME = 1_000 * 60 * 5 // 5 minutes

export type UseBasicNameOptions = {
  name?: string | null
  normalised?: boolean
  enabled?: boolean
  subgraphEnabled?: boolean
}

export const useBasicName = ({
  name,
  normalised = false,
  enabled = true,
  subgraphEnabled = true,
}: UseBasicNameOptions) => {
  const validation = useValidate({ input: name!, enabled: enabled && !!name })

  const { name: _normalisedName, isValid, isShort, isETH, is2LD } = validation

  const normalisedName = normalised ? name! : _normalisedName

  const { data: supportedTLD, isLoading: supportedTLDLoading } = useSupportsTLD(normalisedName)

  const commonEnabled = enabled && !!name && isValid && !(isETH && isShort)
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
    enabled: commonEnabled && !isRoot,
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

  const nameWrapperAddress = useContractAddress({ contract: 'ensNameWrapper' })
  const isWrapped = !!wrapperData

  const registrationStatusTimestamp = useMemo(() => {
    if (!isTempPremiumDesynced) return Date.now()
    if (blockTimestamp) return Number(blockTimestamp) * 1000
    return Date.now() - EXPIRY_LIVE_WATCH_TIME
  }, [isTempPremiumDesynced, blockTimestamp])

  const isNameAndPublicCallsLoaded = !!name && !publicCallsLoading
  const registrationStatus = isNameAndPublicCallsLoaded
    ? getRegistrationStatus({
        timestamp: registrationStatusTimestamp,
        validation,
        ownerData,
        wrapperData,
        expiryData,
        priceData,
        addrData,
        supportedTLD,
        name: normalisedName,
      })
    : undefined

  const canBeWrapped = useMemo(
    () =>
      !!(
        nameWrapperAddress &&
        !isWrapped &&
        normalisedName?.endsWith('.eth') &&
        !isLabelTooLong(normalisedName) &&
        !!registrationStatus &&
        ['registered', 'imported', 'owned'].includes(registrationStatus)
      ),
    [nameWrapperAddress, isWrapped, normalisedName, registrationStatus],
  )

  const { data: subgraphRegistrant } = useSubgraphRegistrant({
    name: normalisedName,
    enabled:
      enabled &&
      subgraphEnabled &&
      registrationStatus === 'gracePeriod' &&
      is2LD &&
      isETH &&
      !isWrapped,
  })

  const ownerDataWithSubgraphRegistrant = useMemo(() => {
    if (!ownerData) return ownerData
    const checkSumSubgraphRegistrant = subgraphRegistrant
      ? getAddress(subgraphRegistrant)
      : undefined
    return {
      ...ownerData,
      registrant: ownerData?.registrant ?? checkSumSubgraphRegistrant,
    } as UseOwnerReturnType
  }, [ownerData, subgraphRegistrant])

  const truncatedName = normalisedName ? truncateFormat(normalisedName) : undefined

  const pccExpired = usePccExpired({ ownerData, wrapperData })

  const isLoading = publicCallsLoading || supportedTLDLoading
  return {
    ...validation,
    normalisedName,
    ownerData: ownerDataWithSubgraphRegistrant,
    wrapperData,
    priceData,
    expiryDate,
    gracePeriodEndDate,
    isLoading,
    truncatedName,
    registrationStatus,
    isWrapped,
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
