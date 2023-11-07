import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, OutlinkSVG, QuestionSVG, Typography } from '@ensdomains/thorin2'

import { getSupportLink } from '@app/utils/supportLinks'

const CenteredTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

const Link = styled.a(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[1]};
  `,
)

const IconWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: ${theme.space[5]};
    height: ${theme.space[5]};
    background-color: ${theme.colors.indigo};
    color: ${theme.colors.background};
    border-radius: ${theme.radii.full};

    svg {
      width: 60%;
      height: 60%;
    }
  `,
)

const OutlinkWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space[3]};
    height: ${theme.space[3]};
    color: ${theme.colors.indigo};
  `,
)

type Props = {
  onConfirm: () => void
  onBack: () => void
}

export const ConfirmationView = ({ onConfirm, onBack }: Props) => {
  const { t } = useTranslation('transactionFlow')
  const link = getSupportLink('sendingNames')
  return (
    <>
      <Dialog.Heading alert="warning" title={t('input.sendName.views.confirmation.title')} />
      <CenteredTypography fontVariant="body">
        {t('input.sendName.views.confirmation.description')}
      </CenteredTypography>
      <CenteredTypography fontVariant="body">
        {t('input.sendName.views.confirmation.warning')}
      </CenteredTypography>
      {link && (
        <Link href={link} target="_blank" rel="noreferrer noopener">
          <IconWrapper>
            <QuestionSVG />
          </IconWrapper>
          <Typography fontVariant="body" color="indigo">
            {t('input.sendName.views.confirmation.learnMore')}
          </Typography>
          <OutlinkWrapper as={OutlinkSVG} />
        </Link>
      )}
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onBack}>
            {t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button data-testid="send-name-confirm-button" onClick={onConfirm}>
            {t('action.understand', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
