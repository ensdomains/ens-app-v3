import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CheckboxRow, Dialog, Typography } from '@ensdomains/thorin'

import type { FormData } from '../RevokePermissions-flow'

type Props = {
  register: UseFormRegister<FormData>
}

const CenterAlignedTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

export const RevokeUnwrapView = ({ register }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading title={t('input.revokePermissions.views.revokeUnwrap.title')} />
      <CenterAlignedTypography fontVariant="body" color="text">
        {t('input.revokePermissions.views.revokeUnwrap.subtitle')}
      </CenterAlignedTypography>
      <CheckboxRow
        data-testid="checkbox-CANNOT_UNWRAP"
        label={t('input.revokePermissions.views.revokeUnwrap.fuses.CANNOT_UNWRAP')}
        {...register('childFuses.CANNOT_UNWRAP', {})}
      />
    </>
  )
}
