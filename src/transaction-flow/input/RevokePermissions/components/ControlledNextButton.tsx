import { ComponentProps, useMemo } from 'react'
import { Control, useFormState, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@ensdomains/thorin'

import type { Fuse } from '@app/transaction-flow/transaction/changePermissions'

import type { FormData, View } from '../RevokePermissions-flow'

export const ControlledNextButton = ({
  view,
  isLastView,
  control,
  unburnedFuses,
  onIncrement,
  onSubmit,
}: {
  view: View
  isLastView: boolean
  control: Control<FormData>
  unburnedFuses: Fuse[]
  onIncrement: () => void
  onSubmit: () => void
}) => {
  const { t } = useTranslation('transactionFlow')
  const [parentFuses, childFuses] = useWatch({ control, name: ['parentFuses', 'childFuses'] })
  const formState = useFormState({ control, name: 'expiryCustom' })
  const isCustomExpiryValid = formState.errors.expiryCustom === undefined

  /**
   * Fuses that have burned during this flow. Must breakdown the fuses individually for useMemo to
   * work properly.
   */
  const fusesBurnedDuringFlow = useMemo(() => {
    const allFuses: { [key in Fuse]: boolean } = {
      PARENT_CANNOT_CONTROL: parentFuses.PARENT_CANNOT_CONTROL,
      CAN_EXTEND_EXPIRY: parentFuses.CAN_EXTEND_EXPIRY,
      CANNOT_UNWRAP: childFuses.CANNOT_UNWRAP,
      CANNOT_CREATE_SUBDOMAIN: childFuses.CANNOT_CREATE_SUBDOMAIN,
      CANNOT_TRANSFER: childFuses.CANNOT_TRANSFER,
      CANNOT_SET_RESOLVER: childFuses.CANNOT_SET_RESOLVER,
      CANNOT_SET_TTL: childFuses.CANNOT_SET_TTL,
      CANNOT_APPROVE: childFuses.CANNOT_APPROVE,
      CANNOT_BURN_FUSES: childFuses.CANNOT_BURN_FUSES,
    }
    const allFuseKeys = Object.keys(allFuses) as Fuse[]
    const burnedFuses = allFuseKeys.filter((fuse) => allFuses[fuse])
    return burnedFuses.filter((fuse) => unburnedFuses.includes(fuse))
  }, [
    parentFuses.PARENT_CANNOT_CONTROL,
    parentFuses.CAN_EXTEND_EXPIRY,
    childFuses.CANNOT_UNWRAP,
    childFuses.CANNOT_CREATE_SUBDOMAIN,
    childFuses.CANNOT_TRANSFER,
    childFuses.CANNOT_SET_RESOLVER,
    childFuses.CANNOT_SET_TTL,
    childFuses.CANNOT_APPROVE,
    childFuses.CANNOT_BURN_FUSES,
    unburnedFuses,
  ])

  const props: ComponentProps<typeof Button> = useMemo(() => {
    const defaultProps: ComponentProps<typeof Button> = {
      disabled: false,
      color: 'accent',
      count: 0,
      onClick: isLastView ? onSubmit : onIncrement,
      children: t('action.next', { ns: 'common' }),
    }

    switch (view) {
      case 'revokeWarning':
        return {
          ...defaultProps,
          color: 'red',
          children: t('action.understand', { ns: 'common' }),
        }
      case 'revokePCC':
        return {
          ...defaultProps,
          disabled: parentFuses.PARENT_CANNOT_CONTROL === false,
        }
      case 'grantExtendExpiry':
        return {
          ...defaultProps,
          disabled: parentFuses.CAN_EXTEND_EXPIRY === false,
        }
      case 'setExpiry': {
        return {
          ...defaultProps,
          disabled: !isCustomExpiryValid,
        }
      }
      case 'revokeUnwrap':
        return {
          ...defaultProps,
          disabled: childFuses.CANNOT_UNWRAP === false,
        }
      case 'parentRevokePermissions': {
        const burnedParentFuses = parentFuses.CAN_EXTEND_EXPIRY ? 1 : 0
        const count = childFuses.CANNOT_UNWRAP
          ? fusesBurnedDuringFlow.length - 1
          : burnedParentFuses
        return {
          ...defaultProps,
          count,
          disabled: fusesBurnedDuringFlow.length === 0,
          onClick:
            childFuses.CANNOT_UNWRAP && childFuses.CANNOT_BURN_FUSES ? onIncrement : onSubmit,
          children:
            count === 0
              ? t('action.skip', { ns: 'common' })
              : t('input.revokePermissions.action.revoke'),
        }
      }
      case 'revokePermissions': {
        const flowIncludesCannotUnwrap = unburnedFuses.includes('CANNOT_UNWRAP')
        const count = flowIncludesCannotUnwrap
          ? fusesBurnedDuringFlow.length - 1
          : fusesBurnedDuringFlow.length
        const buttonTitle =
          flowIncludesCannotUnwrap && fusesBurnedDuringFlow.length === 1
            ? t('action.skip', { ns: 'common' })
            : t('input.revokePermissions.action.revoke')
        return {
          ...defaultProps,
          count,
          disabled: fusesBurnedDuringFlow.length === 0,
          onClick: childFuses.CANNOT_BURN_FUSES ? onIncrement : onSubmit,
          children: buttonTitle,
        }
      }
      case 'revokeChangeFuses':
        return {
          ...defaultProps,
          disabled: childFuses.CANNOT_BURN_FUSES === false,
        }
      case 'revokeChangeFusesWarning':
        return {
          ...defaultProps,
          onClick: onSubmit,
        }
      default:
        return defaultProps
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, parentFuses, childFuses, unburnedFuses, fusesBurnedDuringFlow, isCustomExpiryValid])

  return <Button data-testid="permissions-next-button" {...props} />
}
