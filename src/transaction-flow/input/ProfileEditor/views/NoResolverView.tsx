import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'

import { CenteredTypography } from '../components/CenteredTypography'
import { ContentContainer } from '../components/ContentContainer'
import { StyledInnerDialog } from '../components/StyledInnerDialog'

type Props = {
  onConfirm?: () => void
  onCancel?: () => void
  onSkip?: () => void
}
export const NoResolverView = ({ onConfirm, onCancel, onSkip }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.warningOverlay.noResolver.title')}
        alert="error"
      />
      <StyledInnerDialog>
        <ContentContainer>
          <CenteredTypography>
            {t('input.profileEditor.warningOverlay.noResolver.subtitle')}{' '}
          </CenteredTypography>
          <Outlink href="">
            {t('input.profileEditor.warningOverlay.action.learnMoreResolvers')}
          </Outlink>
        </ContentContainer>
      </StyledInnerDialog>
      <Dialog.Footer
        leading={
          <Button
            colorStyle="accentSecondary"
            onClick={onCancel}
            data-testid="warning-overlay-secondary-action"
          >
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button onClick={onConfirm} data-testid="profile-editor-overlay-button">
            {t('input.profileEditor.warningOverlay.action.setResolver')}
          </Button>
        }
      />
    </>
  )
}
