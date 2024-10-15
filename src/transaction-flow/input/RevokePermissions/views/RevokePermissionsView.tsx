import { forwardRef } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { ChildFuseKeys, ChildFuseReferenceType } from '@ensdomains/ensjs/utils'
import { CheckboxRow, Dialog } from '@ensdomains/thorin'

import type { FormData, RevokePermissionsDialogContentProps } from '../RevokePermissions-flow'

type FusePermission = ChildFuseReferenceType['Key']

type Props = {
  register: UseFormRegister<FormData>
  unburnedFuses: FusePermission[]
} & RevokePermissionsDialogContentProps

const CHILD_FUSES_WITHOUT_CU_AND_CBF = ChildFuseKeys.filter(
  (fuse) => !['CANNOT_UNWRAP', 'CANNOT_BURN_FUSES'].includes(fuse),
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

export const RevokePermissionsView = forwardRef<HTMLFormElement, Props>(
  ({ register, unburnedFuses, ...dialogContentProps }, ref) => {
    const { t } = useTranslation('transactionFlow')

    const { burned, unburned } = CHILD_FUSES_WITHOUT_CU_AND_CBF.reduce<{
      burned: FusePermission[]
      unburned: FusePermission[]
    }>(
      (filteredFuses, fuse) => {
        const isUnburned = unburnedFuses.includes(fuse)
        if (isUnburned) filteredFuses.unburned.push(fuse)
        else filteredFuses.burned.push(fuse)
        return filteredFuses
      },
      { burned: [], unburned: [] },
    )

    return (
      <>
        <Dialog.Heading title={t('input.revokePermissions.views.revokePermissions.title')} />
        <Dialog.Content gap="2" {...dialogContentProps} ref={ref}>
          {unburned.map((fuse) => (
            <CheckboxRow
              data-testid={`checkbox-${fuse}`}
              key={fuse}
              label={t(getPermissionTranslationKey(fuse))}
              {...register(`childFuses.${fuse}`)}
            />
          ))}
          {burned.map((fuse) => (
            <CheckboxRow
              data-testid={`checkbox-${fuse}`}
              key={fuse}
              label={t(getPermissionTranslationKey(fuse))}
              disabled
              {...register(`childFuses.${fuse}`)}
            />
          ))}
        </Dialog.Content>
      </>
    )
  },
)
