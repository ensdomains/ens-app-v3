import { useEns } from '@app/utils/EnsProvider'
import { yearsToSeconds } from '@app/utils/utils'
import { emptyAddress } from '@app/utils/constants'
import type { BigNumber } from 'ethers'
import { useQuery } from 'react-query'

export type RegistrationStatus =
  | 'invalid'
  | 'registered'
  | 'gracePeriod'
  | 'premium'
  | 'available'
  | 'short'
  | 'notImported'
  | 'notOwned'

export const useRegistrationStatus = (name: string) => {
  const { ready, getExpiry, getPrice, getOwner, batch } = useEns()

  const { data, isLoading, status } = useQuery(
    ['registrationStatus', name],
    async (): Promise<RegistrationStatus> => {
      const labels = name.split('.')
      const isDotETH = labels[labels.length - 1] === 'eth'
      if (isDotETH && labels.length === 2) {
        if (labels[0].length < 3) {
          return 'short'
        }
        const batchResults = await batch(
          getExpiry.batch(name),
          getPrice.batch(labels[0], yearsToSeconds(1), true),
        )
        if (!batchResults) return 'invalid'
        const [expiryData, priceData] = batchResults
        if (expiryData && expiryData.expiry) {
          const { expiry, gracePeriod } = expiryData as {
            expiry: Date
            gracePeriod: number
          }
          if (expiry.getTime() > Date.now()) {
            return 'registered'
          }
          if (expiry.getTime() + gracePeriod > Date.now()) {
            return 'gracePeriod'
          }
          const { premium } = priceData as {
            base: BigNumber
            premium: BigNumber
          }
          if (premium.gt(0)) {
            return 'premium'
          }
        }
        return 'available'
      }
      const owner = await getOwner(name, 'registry')
      if (owner && owner.owner !== emptyAddress) {
        return 'registered'
      }
      if (labels.length > 2) {
        return 'notOwned'
      }
      return 'notImported'
    },
    {
      enabled: ready && !!name,
    },
  )

  return { data, isLoading, status }
}
