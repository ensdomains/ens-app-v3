import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'
import { getSupportLink } from '@app/utils/supportLinks'

import { CenteredTypography } from '../components/CenteredTypography'
import { SkipButton } from '../components/SkipButton'

type Props = {
  onConfirm?: () => void
  onCancel?: () => void
  onSkip?: () => void
}
export const ResolverOutOfDateView = ({ onConfirm, onCancel, onSkip }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.warningOverlay.resolverOutOfDate.title')}
        alert="warning"
      />
      <Dialog.Content>
        <CenteredTypography>
          {t('input.profileEditor.warningOverlay.resolverOutOfDate.subtitle')}
        </CenteredTypography>
        <Outlink href={getSupportLink('resolver')}>
          {t('input.profileEditor.warningOverlay.action.learnMoreResolvers')}
        </Outlink>
        <SkipButton
          data-testid="warning-overlay-skip-button"
          description={t('input.profileEditor.warningOverlay.action.ignoreUpdate')}
          actionLabel={t('action.skip', { ns: 'common' })}
          onClick={onSkip}
        />
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button
            colorStyle="accentSecondary"
            onClick={onCancel}
            data-testid="warning-overlay-back-button"
          >
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button onClick={onConfirm} data-testid="warning-overlay-next-button">
            {t('input.profileEditor.warningOverlay.action.updateResolver')}
          </Button>
        }
      />
    </>
  )
}
