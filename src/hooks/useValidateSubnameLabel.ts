import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { emptyAddress } from '@app/utils/constants'
import { isLabelTooLong } from '@app/utils/utils'

import { useGetWrapperData } from './useGetWrapperData'
import { useValidate } from './useValidate'

export const useValidateSubnameLabel = (name: string, label: string, isWrapped: boolean) => {
  const { getOwner, ready } = useEns()

  const isParentTLD = name.split('.').length === 1

  const skipValidation = !label || !name || !ready || isParentTLD
  const validation = useValidate(label, skipValidation)

  const skipGetOwner = skipValidation || !validation.valid
  const { data: ownership, isLoading: isGetOwnerLoading } = useQuery(
    [validation.name, 'createSubname', 'getOwner'],
    () => getOwner(`${validation.name}.${name}`),
    {
      refetchOnMount: true,
      enabled: !skipGetOwner,
    },
  )

  const skipGetWrapperData = skipGetOwner || !isWrapped
  const { wrapperData, isLoading: isGetWrapperDataLoading } = useGetWrapperData(
    `${validation.name}.${name}`,
    skipGetWrapperData,
  )
  const isPCCBurned = !!wrapperData?.parent?.PARENT_CANNOT_CONTROL

  const isLoading = isGetOwnerLoading || isGetWrapperDataLoading || !ready

  const { valid, error, expiryLabel } = useMemo(() => {
    if (label === '') return { valid: false, error: undefined }
    if (isParentTLD) return { valid: false, error: undefined }
    if (label !== label.toLowerCase()) return { valid: false, error: 'mustUseLowercase' }
    if (isWrapped && isLabelTooLong(label)) return { valid: false, error: 'nameTooLong' }
    if (isWrapped && isPCCBurned) {
      return {
        valid: false,
        error: 'pccBurned',
        expiryLabel: wrapperData.expiryDate
          ? new Date(wrapperData.expiryDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : undefined,
      }
    }
    if (!validation.valid) return { valid: false, error: 'invalidCharacters' }
    if (!ownership?.owner || (ownership.owner && ownership.owner === emptyAddress))
      return { valid: true, error: undefined }
    return { valid: false, error: 'alreadyExists' }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownership?.owner, label, validation.valid, isWrapped, isPCCBurned, isParentTLD])

  return {
    valid,
    isLoading,
    ...(expiryLabel ? { expiryLabel } : {}),
    ...(error ? { error } : {}),
  }
}
