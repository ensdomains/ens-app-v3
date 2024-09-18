import { forwardRef } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import type { Address } from 'viem'

import { CheckboxRow, Dialog, Typography } from '@ensdomains/thorin'

import { usePrimaryNameOrAddress } from '@app/hooks/reverseRecord/usePrimaryNameOrAddress'

import type { FormData, RevokePermissionsDialogContentProps } from '../RevokePermissions-flow'

type Props = {
  managerAddress: Address
  register: UseFormRegister<FormData>
  onDismiss: () => void
} & RevokePermissionsDialogContentProps

const CenterAlignedTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

export const RevokePCCView = forwardRef<HTMLFormElement, Props>(
  ({ managerAddress, register, ...dialogContentProps }, ref) => {
    const { t } = useTranslation('transactionFlow')

    const { data: { nameOrAddr } = {} } = usePrimaryNameOrAddress({ address: managerAddress })

    return (
      <>
        <Dialog.Heading title={t('input.revokePermissions.views.revokePCC.title')} />
        <Dialog.Content {...dialogContentProps} ref={ref}>
          <CenterAlignedTypography fontVariant="body" color="text">
            <Trans
              i18nKey="input.revokePermissions.views.revokePCC.subtitle"
              t={t}
              values={{ account: nameOrAddr }}
            />
          </CenterAlignedTypography>
          <CheckboxRow
            data-testid="checkbox-pcc"
            label={t('input.revokePermissions.views.revokePCC.title')}
            {...register('parentFuses.PARENT_CANNOT_CONTROL')}
          />
        </Dialog.Content>
      </>
    )
  },
)
