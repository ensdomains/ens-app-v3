import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Dialog, Toggle, Typography } from '@ensdomains/thorin'

import { CenterAlignedTypography } from '../components/CenterAlignedTypography'

type Props = {
  revokeAdditional: boolean
  onChangeRevokeAdditional: (e: ChangeEvent<HTMLInputElement>) => void
  onDismiss: () => void
}

const ToggleContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.input};
    padding: ${theme.space[4]};
    gap: ${theme.space[4]};
  `,
)

const ToggleInfo = styled.div(
  () => css`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
)

export const RevokeAdditionalView = ({
  revokeAdditional = false,
  onChangeRevokeAdditional,
  onDismiss,
}: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading
        title={t('input.revokePermissions.views.revokeAdditional.title')}
        onDismiss={() => onDismiss()}
      />
      <CenterAlignedTypography typography="Body/Normal" color="text">
        {t('input.revokePermissions.views.revokeAdditional.subtitle')}
      </CenterAlignedTypography>
      <ToggleContainer>
        <ToggleInfo>
          <Typography typography="Body/Bold" color="text">
            {t('input.revokePermissions.views.revokeAdditional.action.title')}
          </Typography>
          <Typography typography="Body/Normal" color="text">
            {t('input.revokePermissions.views.revokeAdditional.action.description')}
          </Typography>
        </ToggleInfo>
        <div>
          <Toggle checked={revokeAdditional} onChange={onChangeRevokeAdditional} />
        </div>
      </ToggleContainer>
    </>
  )
}
