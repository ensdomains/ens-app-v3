import { useMemo } from 'react'

import { GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'

export type NameWrapperState = 'unwrapped' | 'wrapped' | 'emancipated' | 'locked'

type Results = {
  parentState: NameWrapperState
  isUserParentOwner: boolean
  parentExpiry?: number
  parentExpiryLabel?: string
  state: NameWrapperState
  isUserOwner: boolean
  expiryLabel?: string
  expiry?: number
}

const makeExpiryNumberAndLabel = (expiryDate: Date | undefined) => {
  const expiry = expiryDate ? Math.floor(new Date(expiryDate).getTime() / 1000) : 0
  const expiryLabel = expiryDate
    ? new Date(expiryDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : undefined

  return { expiry, expiryLabel }
}

export const useFusesStates = ({
  wrapperData,
  parentWrapperData,
}: {
  wrapperData?: GetWrapperDataReturnType
  parentWrapperData?: GetWrapperDataReturnType
}) => {
  const { address } = useAccountSafely()

  return useMemo(() => {
    const defaultValues: Results = {
      parentState: 'unwrapped',
      state: 'unwrapped',
      isUserOwner: false,
      isUserParentOwner: false,
    }

    if (parentWrapperData) defaultValues.parentState = 'wrapped'
    if (parentWrapperData?.fuses.parent.PARENT_CANNOT_CONTROL)
      defaultValues.parentState = 'emancipated'
    if (parentWrapperData?.fuses.child.CANNOT_UNWRAP) defaultValues.parentState = 'locked'
    if (wrapperData) defaultValues.state = 'wrapped'
    if (wrapperData?.fuses.parent.PARENT_CANNOT_CONTROL) defaultValues.state = 'emancipated'
    if (wrapperData?.fuses.child.CANNOT_UNWRAP) defaultValues.state = 'locked'

    if (wrapperData) {
      const { expiry, expiryLabel } = makeExpiryNumberAndLabel(wrapperData.expiry?.date)
      defaultValues.expiry = expiry
      defaultValues.expiryLabel = expiryLabel
    }

    if (parentWrapperData) {
      const { expiry, expiryLabel } = makeExpiryNumberAndLabel(parentWrapperData.expiry?.date)
      defaultValues.parentExpiry = expiry
      defaultValues.parentExpiryLabel = expiryLabel
    }

    if (address) {
      defaultValues.isUserOwner = !!wrapperData?.owner && wrapperData.owner === address
      defaultValues.isUserParentOwner =
        !!parentWrapperData?.owner && parentWrapperData?.owner === address
    }

    return defaultValues
  }, [wrapperData, parentWrapperData, address])
}
