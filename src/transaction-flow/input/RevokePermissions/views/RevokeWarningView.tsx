import { forwardRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Dialog } from '@ensdomains/thorin'

import { getSupportLink } from '@app/utils/supportLinks'

import { CenterAlignedTypography } from '../components/CenterAlignedTypography'
import type { RevokePermissionsDialogContentProps } from '../RevokePermissions-flow'

const StyledAnchor = styled.a(
  ({ theme }) => css`
    color: ${theme.colors.accent};
    font-weight: ${theme.fontWeights.bold};
  `,
)

export const RevokeWarningView = forwardRef<HTMLFormElement, RevokePermissionsDialogContentProps>(
  (dialogContentProps, ref) => {
    const { t } = useTranslation('transactionFlow')

    return (
      <>
        <Dialog.Heading
          title={t('input.revokePermissions.views.revokeWarning.title')}
          alert="error"
        />
        <Dialog.Content {...dialogContentProps} ref={ref}>
          <CenterAlignedTypography fontVariant="bodyBold">
            {t('input.revokePermissions.views.revokeWarning.subtitle')}
          </CenterAlignedTypography>
          <CenterAlignedTypography fontVariant="body">
            <Trans
              i18nKey="input.revokePermissions.views.revokeWarning.subtitle2"
              t={t}
              components={{
                infoLink: (
                  <StyledAnchor href={getSupportLink('fuses')} target="_blank" rel="noreferrer" />
                ),
              }}
            >
              {t('input.revokePermissions.views.revokeWarning.subtitle2')}
            </Trans>
          </CenterAlignedTypography>
        </Dialog.Content>
      </>
    )
  },
)
