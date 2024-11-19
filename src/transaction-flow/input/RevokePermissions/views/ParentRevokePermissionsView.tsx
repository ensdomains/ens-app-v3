import { forwardRef } from 'react'
import { Control, UseFormRegister, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import {
  ChildFuseKeys,
  ChildFuseReferenceType,
  ParentFuseReferenceType,
} from '@ensdomains/ensjs/utils'
import { CheckboxRow, Dialog } from '@ensdomains/thorin'

import type { FormData, RevokePermissionsDialogContentProps } from '../RevokePermissions-flow'

type FusePermission = ChildFuseReferenceType['Key']

type Props = {
  register: UseFormRegister<FormData>
  control: Control<FormData>
  unburnedFuses: (FusePermission | ParentFuseReferenceType['Key'])[]
} & RevokePermissionsDialogContentProps

const CHILD_FUSES_WITHOUT_CU: FusePermission[] = ChildFuseKeys.filter(
  (fuse) => fuse !== 'CANNOT_UNWRAP',
)

const getPermissionTranslationKey = (fuse: FusePermission): string =>
  match(fuse)
    .with(
      'CANNOT_UNWRAP',
      () => 'input.revokePermissions.views.revokePermissions.fuses.CANNOT_UNWRAP',
    )
    .with(
      'CANNOT_BURN_FUSES',
      () => 'input.revokePermissions.views.revokePermissions.fuses.CANNOT_BURN_FUSES',
    )
    .with(
      'CANNOT_TRANSFER',
      () => 'input.revokePermissions.views.revokePermissions.fuses.CANNOT_TRANSFER',
    )
    .with(
      'CANNOT_SET_RESOLVER',
      () => 'input.revokePermissions.views.revokePermissions.fuses.CANNOT_SET_RESOLVER',
    )
    .with(
      'CANNOT_SET_TTL',
      () => 'input.revokePermissions.views.revokePermissions.fuses.CANNOT_SET_TTL',
    )
    .with(
      'CANNOT_CREATE_SUBDOMAIN',
      () => 'input.revokePermissions.views.revokePermissions.fuses.CANNOT_CREATE_SUBDOMAIN',
    )
    .with(
      'CANNOT_APPROVE',
      () => 'input.revokePermissions.views.revokePermissions.fuses.CANNOT_APPROVE',
    )
    .otherwise(() => '')

export const ParentRevokePermissionsView = forwardRef<HTMLFormElement, Props>(
  ({ register, control, unburnedFuses, ...dialogContentProps }, ref) => {
    const { t } = useTranslation('transactionFlow')

    const unwrapped = useWatch({ control, name: 'childFuses.CANNOT_UNWRAP' })

    const isCEEUnburned = unburnedFuses.includes('CAN_EXTEND_EXPIRY')

    return (
      <>
        <Dialog.Heading title={t('input.revokePermissions.views.revokePermissions.title')} />
        <Dialog.Content {...dialogContentProps} gap="2" ref={ref}>
          {isCEEUnburned && (
            <CheckboxRow
              data-testid="checkbox-CAN_EXTEND_EXPIRY"
              label={t('input.revokePermissions.views.revokePermissions.fuses.CAN_EXTEND_EXPIRY')}
              {...register(`parentFuses.CAN_EXTEND_EXPIRY`)}
            />
          )}
          <CheckboxRow
            data-testid="checkbox-CANNOT_UNWRAP"
            label={t('input.revokePermissions.views.revokePermissions.fuses.CANNOT_UNWRAP')}
            {...register('childFuses.CANNOT_UNWRAP')}
          />
          {CHILD_FUSES_WITHOUT_CU.map((fuse) => (
            <CheckboxRow
              data-testid={`checkbox-${fuse}`}
              key={fuse}
              label={t(getPermissionTranslationKey(fuse))}
              disabled={!unwrapped}
              {...register(`childFuses.${fuse}`)}
            />
          ))}
        </Dialog.Content>
      </>
    )
  },
)
