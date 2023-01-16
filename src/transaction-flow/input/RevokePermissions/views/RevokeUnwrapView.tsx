import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Dialog, Typography } from '@ensdomains/thorin'

import { PermissionsCheckbox } from '@app/components/@molecules/PermissionsCheckbox/PermissionsCheckbox'

import type { FormData } from '../RevokePermissions-flow'

type Props = {
  register: UseFormRegister<FormData>
  onDismiss: () => void
}

const CenterAlignedTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

export const RevokeUnwrapView = ({ register, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading
        title={t('input.revokePermissions.views.revokeUnwrap.title')}
        onDismiss={() => onDismiss()}
      />
      <CenterAlignedTypography typography="Body/Normal" color="text">
        {t('input.revokePermissions.views.revokeUnwrap.subtitle')}
      </CenterAlignedTypography>
      <PermissionsCheckbox
        title="Revoke permission to: Unwrap this name"
        {...register('fuseObj.CANNOT_UNWRAP', {})}
      />
    </>
  )
}
