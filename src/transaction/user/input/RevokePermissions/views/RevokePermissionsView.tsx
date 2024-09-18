import { forwardRef } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ChildFuseKeys, ChildFuseReferenceType } from '@ensdomains/ensjs/utils'
import { CheckboxRow, Dialog } from '@ensdomains/thorin'

import type { FormData, RevokePermissionsDialogContentProps } from '../RevokePermissions-flow'

type Props = {
  register: UseFormRegister<FormData>
  unburnedFuses: ChildFuseReferenceType['Key'][]
} & RevokePermissionsDialogContentProps

const CHILD_FUSES_WITHOUT_CU_AND_CBF = ChildFuseKeys.filter(
  (fuse) => !['CANNOT_UNWRAP', 'CANNOT_BURN_FUSES'].includes(fuse),
)

export const RevokePermissionsView = forwardRef<HTMLFormElement, Props>(
  ({ register, unburnedFuses, ...dialogContentProps }, ref) => {
    const { t } = useTranslation('transactionFlow')

    const { burned, unburned } = CHILD_FUSES_WITHOUT_CU_AND_CBF.reduce<{
      burned: ChildFuseReferenceType['Key'][]
      unburned: ChildFuseReferenceType['Key'][]
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
              label={t(`input.revokePermissions.views.revokePermissions.fuses.${fuse}`)}
              {...register(`childFuses.${fuse}`)}
            />
          ))}
          {burned.map((fuse) => (
            <CheckboxRow
              data-testid={`checkbox-${fuse}`}
              key={fuse}
              label={t(`input.revokePermissions.views.revokePermissions.fuses.${fuse}`)}
              disabled
              {...register(`childFuses.${fuse}`)}
            />
          ))}
        </Dialog.Content>
      </>
    )
  },
)
