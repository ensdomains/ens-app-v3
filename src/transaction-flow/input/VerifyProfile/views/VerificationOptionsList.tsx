/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog } from '@ensdomains/thorin'

import VerifiedRecordSVG from '@app/assets/VerifiedRecord.svg'
import type { useVerifiedRecords } from '@app/hooks/verification/useVerifiedRecords/useVerifiedRecords'

import { CenteredTypography } from '../../ProfileEditor/components/CenteredTypography'

const IconWrapper = styled.div(
  ({ theme }) => css`
    svg {
      color: ${theme.colors.accent};
      width: ${theme.space['16']};
      height: ${theme.space['16']};
      display: block;
    }
  `,
)

export const VerificationOptionsList = ({
  verificationData,
  onDismiss,
}: {
  verificationData?: ReturnType<typeof useVerifiedRecords>['data']
  onDismiss?: () => void
}) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <IconWrapper>
        <VerifiedRecordSVG />
      </IconWrapper>
      <Dialog.Heading title={t('input.verifyProfile.list.title')} />
      <Dialog.Content>
        <CenteredTypography>{t('input.verifyProfile.list.noOptions')}</CenteredTypography>
      </Dialog.Content>
      <Dialog.Footer
        trailing={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.close', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
