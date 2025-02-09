import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { CenteredTypography } from '../components/CenteredTypography'
import { DetailedSwitch } from '../components/DetailedSwitch'
import type { SelectedProfile } from '../ProfileEditor-flow'

type Props = {
  onNext: (profile: SelectedProfile) => void
  onBack: () => void
}
export const TransferOrResetProfileView = ({ onNext, onBack }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const [selected, setSelected] = useState<SelectedProfile>('latest')

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
          onChange={(e) => setSelected(e.currentTarget.checked ? 'latest' : 'reset')}
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
          <Button onClick={() => onNext(selected)} data-testid="warning-overlay-next-button">
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
