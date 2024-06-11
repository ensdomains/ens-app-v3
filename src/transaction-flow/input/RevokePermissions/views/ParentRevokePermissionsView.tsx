import { forwardRef } from 'react'
import { Control, UseFormRegister, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  ChildFuseKeys,
  ChildFuseReferenceType,
  ParentFuseReferenceType,
} from '@ensdomains/ensjs/utils'
import { CheckboxRow, Dialog } from '@ensdomains/thorin'

import type { FormData, RevokePermissionsDialogContentProps } from '../RevokePermissions-flow'

type Props = {
  register: UseFormRegister<FormData>
  control: Control<FormData>
  unburnedFuses: (ChildFuseReferenceType['Key'] | ParentFuseReferenceType['Key'])[]
} & RevokePermissionsDialogContentProps

const CHILD_FUSES_WITHOUT_CU: ChildFuseReferenceType['Key'][] = ChildFuseKeys.filter(
  (fuse) => fuse !== 'CANNOT_UNWRAP',
)

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
              label={t(`input.revokePermissions.views.revokePermissions.fuses.${fuse}`)}
              disabled={!unwrapped}
              {...register(`childFuses.${fuse}`)}
            />
          ))}
        </Dialog.Content>
      </>
    )
  },
)
