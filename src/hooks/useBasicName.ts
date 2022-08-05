import { useEns } from '@app/utils/EnsProvider'
import { truncateFormat } from '@ensdomains/ensjs/dist/cjs/utils/format'
import { useQuery } from 'react-query'
import { useValidate } from './useValidate'

export const useBasicName = (name?: string | null, normalised?: boolean) => {
  const { ready, getOwner, getExpiry, batch } = useEns()

  const { name: _normalisedName, valid, labelCount } = useValidate(name!, !name)

  const normalisedName = normalised ? name! : _normalisedName

  const { data: batchData, isLoading: batchLoading } = useQuery(
    ['batch', 'getOwner', 'getExpiry', name],
    () =>
      labelCount === 2 && normalisedName.endsWith('.eth')
        ? batch(getOwner.batch(normalisedName), getExpiry.batch(normalisedName))
        : Promise.all([getOwner(normalisedName)]),
    {
      enabled: !!(ready && name && valid),
    },
  )

  const ownerData = batchData?.[0] as Awaited<ReturnType<typeof getOwner>>

  const expiryData = batchData?.[1] as Awaited<ReturnType<typeof getExpiry>>

  const expiryDate = expiryData?.expiry

  const truncatedName = normalisedName ? truncateFormat(normalisedName) : undefined

  const isLoading = !ready || batchLoading

  return {
    normalisedName,
    valid,
    labelCount,
    ownerData,
    expiryDate,
    isLoading,
    truncatedName,
    isWrapped: ownerData?.ownershipLevel === 'nameWrapper',
  }
}
