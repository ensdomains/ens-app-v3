import { Address } from 'viem'

import { useDefaultReverseRegistryName } from '@app/hooks/ensjs/public/useDefaultReverseRegistryName'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useReverseRegistryName } from '@app/hooks/ensjs/public/useReverseRegistryName'
import { emptyAddress } from '@app/utils/constants'
import { match, P } from 'ts-pattern'

type PrimaryNameSource = 'l1' | 'default' | null

type UsePrimaryNameFromSourcesParameters = {
  address?: Address
  enabled?: boolean
}

export const usePrimaryNameFromSources = ({
  address,
  enabled = true,
}: UsePrimaryNameFromSourcesParameters) => {
  const isEnabled = enabled && !!address && address !== emptyAddress

  const primaryName = usePrimaryName({
    address,
    enabled: isEnabled,
  })

  // Fetch source data if primary name resolves
  const hasPrimaryNameResolved = primaryName.isSuccess && !!primaryName.data?.name

  const reverseRegistryName = useReverseRegistryName({
    address,
    enabled: isEnabled && hasPrimaryNameResolved,
  })
  const hasPrimaryName = !!reverseRegistryName.data
  
  const defaultReverseRegistryName = useDefaultReverseRegistryName({
    address,
    enabled: isEnabled && hasPrimaryNameResolved,
  })
  const hasDefaultPrimaryName = !!defaultReverseRegistryName.data

  const name = primaryName.data?.name ?? null

  const source: PrimaryNameSource = match({
    hasPrimaryName,
    hasDefaultPrimaryName,
    reverseRegistryNameData: reverseRegistryName?.data,
    defaultReverseRegistryNameData: defaultReverseRegistryName?.data,
    name
  })
    .with(
      { name: P.string, hasPrimaryName: true, reverseRegistryNameData: P.when((data) => data === name) },
      () => 'l1' as const,
    )
    .with({ name: P.string, hasDefaultPrimaryName: true,
      defaultReverseRegistryNameData: P.when((data) => data === name)
     }, () => 'default' as const)
    .otherwise(() => null)

  const isLoading = [primaryName, reverseRegistryName, defaultReverseRegistryName].some(({isLoading}) => isLoading)
  const isFetching = [primaryName, reverseRegistryName, defaultReverseRegistryName].some(({ isFetching}) => isFetching)
  const secondaryQueriesSettled = !hasPrimaryNameResolved || (reverseRegistryName.isSuccess || defaultReverseRegistryName.isSuccess)
  const isSuccess = primaryName.isSuccess && secondaryQueriesSettled

  const error = primaryName.error || reverseRegistryName.error || defaultReverseRegistryName.error

  const data = primaryName.data !== undefined ? { ...primaryName.data, hasDefaultPrimaryName, hasPrimaryName, source, reverseRegistryName: reverseRegistryName.data, defaultReverseRegistryName: defaultReverseRegistryName.data } : undefined

  return {
    ...primaryName,
    data,
    isLoading,
    isFetching,
    isSuccess,
    error,
  }
}
