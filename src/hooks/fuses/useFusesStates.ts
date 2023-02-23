import { useMemo } from 'react'

import { useAccountSafely } from '@app/hooks/useAccountSafely'
import type { useEns } from '@app/utils/EnsProvider'

type GetWrapperDataFunc = ReturnType<typeof useEns>['getWrapperData']
type WrapperData = Awaited<ReturnType<GetWrapperDataFunc>>

type NameWrapperState = 'unwrapped' | 'wrapped' | 'emancipated' | 'locked'

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
  const expiryLabel = new Date(expiryDate || 0).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return { expiry, expiryLabel }
}

export const useFusesStates = ({
  wrapperData,
  parentWrapperData,
}: {
  wrapperData?: WrapperData
  parentWrapperData?: WrapperData
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
    if (parentWrapperData?.parent.PARENT_CANNOT_CONTROL) defaultValues.parentState = 'emancipated'
    if (parentWrapperData?.child.CANNOT_UNWRAP) defaultValues.parentState = 'locked'
    if (wrapperData) defaultValues.state = 'wrapped'
    if (wrapperData?.parent.PARENT_CANNOT_CONTROL) defaultValues.state = 'emancipated'
    if (wrapperData?.child.CANNOT_UNWRAP) defaultValues.state = 'locked'

    if (wrapperData) {
      const { expiry, expiryLabel } = makeExpiryNumberAndLabel(wrapperData.expiryDate)
      defaultValues.expiry = expiry
      defaultValues.expiryLabel = expiryLabel
    }

    if (parentWrapperData) {
      const { expiry, expiryLabel } = makeExpiryNumberAndLabel(parentWrapperData.expiryDate)
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
