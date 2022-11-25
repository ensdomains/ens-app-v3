import { useQuery } from 'wagmi'

import { ReturnedENS } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
import { getRegistrationStatus } from '@app/utils/registrationStatus'
import { checkETH2LDName, checkETHName, yearsToSeconds } from '@app/utils/utils'

import { useSupportsTLD } from './useSupportsTLD'

type BaseBatchReturn = [ReturnedENS['getOwner'], ReturnedENS['getWrapperData']]
type ETH2LDBatchReturn = [...BaseBatchReturn, ReturnedENS['getExpiry'], ReturnedENS['getPrice']]

export const useRegistrationStatus = (name = '') => {
  const ens = useEns()

  const { data: supportedTLD } = useSupportsTLD(name)

  const {
    data: batchData,
    isLoading: batchLoading,
    isFetched,
    internal: { isFetchedAfterMount },
    status,
  } = useQuery(
    ['batch', 'getOwner', 'getExpiry', name],
    (): Promise<[] | BaseBatchReturn | ETH2LDBatchReturn | undefined> => {
      const labels = name.split('.')
      const isDotETH = checkETHName(labels)
      if (checkETH2LDName(isDotETH, labels, true)) {
        if (labels[0].length < 3) {
          return Promise.resolve([])
        }
        return ens.batch(
          ens.getOwner.batch(name),
          ens.getWrapperData.batch(name),
          ens.getExpiry.batch(name),
          ens.getPrice.batch(labels[0], yearsToSeconds(1), false),
        )
      }

      return ens.batch(ens.getOwner.batch(name), ens.getWrapperData.batch(normalisedName))
    },
    {
      enabled: !!(ens.ready && name),
    },
  )

  const [ownerData, wrapperData, expiryData, priceData] = batchData || []
  return {
    registrationStatus: getRegistrationStatus({
      name,
      ownerData,
      wrapperData,
      expiryData,
      priceData,
      supportedTLD,
    }),
    isLoading: batchLoading,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
