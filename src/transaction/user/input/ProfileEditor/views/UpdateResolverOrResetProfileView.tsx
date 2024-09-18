/** This is when the current resolver and latest resolver have matching records */
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

export const UpdateResolverOrResetProfileView = ({
  selected,
  onChangeSelected,
  onNext,
  onBack,
}: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.warningOverlay.updateResolverOrResetProfile.title')}
      />
      <Dialog.Content>
        <CenteredTypography>
          {t('input.profileEditor.warningOverlay.updateResolverOrResetProfile.subtitle')}
        </CenteredTypography>
        <DetailedSwitch
          checked={selected !== 'reset'}
          onChange={(e) => onChangeSelected(e.currentTarget.checked ? 'latest' : 'reset')}
          title={t('input.profileEditor.warningOverlay.updateResolverOrResetProfile.toggle.title')}
          description={t(
            'input.profileEditor.warningOverlay.updateResolverOrResetProfile.toggle.subtitle',
          )}
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
