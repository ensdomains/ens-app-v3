import { UseFormRegister } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CheckboxRow, Dialog, Typography } from '@ensdomains/thorin'

import { usePrimaryNameOrAddress } from '@app/hooks/reverseRecord/usePrimaryNameOrAddress'

import type { FormData } from '../RevokePermissions-flow'

type Props = {
  managerAddr: string
  register: UseFormRegister<FormData>
  onDismiss: () => void
}

const CenterAlignedTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

export const RevokePCCView = ({ managerAddr, register }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const { nameOrAddr } = usePrimaryNameOrAddress(managerAddr)

  return (
    <>
      <Dialog.Heading title={t('input.revokePermissions.views.revokePCC.title')} />
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
    </>
  )
}
