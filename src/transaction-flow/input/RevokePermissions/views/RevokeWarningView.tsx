import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Dialog } from '@ensdomains/thorin'

import { CenterAlignedTypography } from '../components/CenterAlignedTypography'

const StyledAnchor = styled.a(
  ({ theme }) => css`
    color: ${theme.colors.accent};
    font-weight: ${theme.fontWeights.bold};
  `,
)

export const RevokeWarningView = () => {
  const { t } = useTranslation('transactionFlow')

  return (
    <>
      <Dialog.Heading
        alert="error"
        title={t('input.revokePermissions.views.revokeWarning.title')}
      />
      <CenterAlignedTypography fontVariant="bodyBold">
        {t('input.revokePermissions.views.revokeWarning.subtitle')}
      </CenterAlignedTypography>
      <CenterAlignedTypography fontVariant="body">
        <Trans
          i18nKey="input.revokePermissions.views.revokeWarning.subtitle2"
          t={t}
          components={{
            infoLink: <StyledAnchor href="https://test.com" />,
          }}
        />
      </CenterAlignedTypography>
    </>
  )
}
