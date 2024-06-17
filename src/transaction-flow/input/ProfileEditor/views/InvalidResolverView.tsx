import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'
import { getSupportLink } from '@app/utils/supportLinks'

import { CenteredTypography } from '../components/CenteredTypography'

type Props = {
  onConfirm?: () => void
  onCancel?: () => void
}
export const InvalidResolverView = ({ onConfirm, onCancel }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.warningOverlay.invalidResolver.title')}
        alert="error"
      />
      <Dialog.Content>
        <CenteredTypography>
          {t('input.profileEditor.warningOverlay.invalidResolver.subtitle')}
        </CenteredTypography>
        <Outlink href={getSupportLink('resolver')}>
          {t('input.profileEditor.warningOverlay.action.learnMoreResolvers')}
        </Outlink>
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
