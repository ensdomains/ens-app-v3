import { useMemo } from 'react'

import { emptyAddress } from '@app/utils/constants'
import { isLabelTooLong } from '@app/utils/utils'

import { useOwner } from './ensjs/public/useOwner'
import { useWrapperData } from './ensjs/public/useWrapperData'
import { usePccExpired } from './fuses/usePccExpired'
import { useValidate } from './useValidate'

type UseValidateSubnameLabelParameters = {
  name: string
  label: string
  isWrapped: boolean
}

export const useValidateSubnameLabel = ({
  name,
  label,
  isWrapped,
}: UseValidateSubnameLabelParameters) => {
  const isParentTLD = name.split('.').length === 1

  const validationEnabled = !!label && !!name && !isParentTLD
  const validation = useValidate({ input: label, enabled: validationEnabled })

  const ownerEnabled = validationEnabled && validation.isValid && validation.labelCount === 1
  const { data: ownership, isLoading: isOwnerLoading } = useOwner({
    name: `${validation.name}.${name}`,
    enabled: ownerEnabled,
  })

  const wrapperDataEnabled = ownerEnabled && isWrapped
  const { data: wrapperData, isLoading: isWrapperDataLoading } = useWrapperData({
    name: `${validation.name}.${name}`,
    enabled: wrapperDataEnabled,
  })
  const isPCCBurned = !!wrapperData?.fuses.parent?.PARENT_CANNOT_CONTROL

  const pccExpired = usePccExpired({ ownerData: ownership, wrapperData })

  const isLoading = isOwnerLoading || isWrapperDataLoading

  const { valid, error, expiryLabel } = useMemo(() => {
    if (label === '') return { valid: false, error: undefined }
    if (isParentTLD) return { valid: false, error: undefined }
    if (label !== label.toLowerCase()) return { valid: false, error: 'mustUseLowercase' }
    if (isWrapped && isLabelTooLong(label)) return { valid: false, error: 'nameTooLong' }
    if (isWrapped && isPCCBurned) {
      return {
        valid: false,
        error: 'pccBurned',
        expiryLabel: wrapperData.expiry?.date
          ? wrapperData.expiry.date.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : undefined,
      }
    }
    if (validation.labelCount > 1 || !validation.isValid)
      return { valid: false, error: 'invalidCharacters' }
    if (
      !ownership?.owner ||
      (ownership.owner && ownership.owner === emptyAddress) ||
      (isWrapped && pccExpired)
    )
      return { valid: true, error: undefined }
    return { valid: false, error: 'alreadyExists' }
  }, [
    label,
    isParentTLD,
    isWrapped,
    isPCCBurned,
    validation.labelCount,
    validation.isValid,
    ownership?.owner,
    pccExpired,
    wrapperData?.expiry?.date,
  ])

  return {
    valid,
    isLoading,
    ...(expiryLabel ? { expiryLabel } : {}),
    ...(error ? { error } : {}),
  }
}
