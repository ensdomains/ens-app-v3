import { Control, UseFormRegister, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CheckboxRow, Dialog } from '@ensdomains/thorin'

import { CHILD_FUSES, ChildFuse, Fuse } from '@app/transaction-flow/transaction/changePermissions'

import type { FormData } from '../RevokePermissions-flow'

type Props = {
  register: UseFormRegister<FormData>
  control: Control<FormData>
  unburnedFuses: Fuse[]
}

const CHILD_FUSES_WITHOUT_CU: ChildFuse[] = CHILD_FUSES.filter((fuse) => fuse !== 'CANNOT_UNWRAP')

const PermissionsList = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
  `,
)

export const ParentRevokePermissionsView = ({ register, control, unburnedFuses }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const unwrapped = useWatch({ control, name: 'childFuses.CANNOT_UNWRAP' })

  const isCEEUnburned = unburnedFuses.includes('CAN_EXTEND_EXPIRY')

  return (
    <>
      <Dialog.Heading title={t('input.revokePermissions.views.revokePermissions.title')} />
      <PermissionsList>
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
          subLabel={t('input.revokePermissions.views.revokePermissions.unwrapSubtitle')}
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
      </PermissionsList>
    </>
  )
}
