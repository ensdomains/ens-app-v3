import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { CenteredTypography } from '../components/CenteredTypography'
import { DetailedSwitch } from '../components/DetailedSwitch'
import type { SelectedProfile } from '../ResolverWarningOverlay'

type Props = {
  selected: SelectedProfile
  onChangeSelected: (selected: SelectedProfile) => void
  onNext: () => void
  onBack: () => void
}
export const TransferOrResetProfileView = ({
  selected,
  onChangeSelected,
  onNext,
  onBack,
}: Props) => {
  const { t } = useTranslation('transactionFlow')

  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.warningOverlay.transferOrResetProfile.title')}
      />
      <Dialog.Content>
        <CenteredTypography>
          {t('input.profileEditor.warningOverlay.transferOrResetProfile.subtitle')}
        </CenteredTypography>
        <DetailedSwitch
          title={t('input.profileEditor.warningOverlay.transferOrResetProfile.toggle.title')}
          description={t(
            'input.profileEditor.warningOverlay.transferOrResetProfile.toggle.subtitle',
          )}
          checked={selected !== 'reset'}
          onChange={(e) => onChangeSelected(e.currentTarget.checked ? 'latest' : 'reset')}
        />
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button
            colorStyle="accentSecondary"
            onClick={onBack}
            data-testid="warning-overlay-back-button"
          >
            {t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button onClick={onNext} data-testid="warning-overlay-next-button">
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
