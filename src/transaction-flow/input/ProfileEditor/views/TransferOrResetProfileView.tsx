import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import type { SelectedProfile } from '../ResolverWarningOverlay'
import { CenteredTypography } from '../components/CenteredTypography'
import { DetailedSwitch } from '../components/DetailedSwitch'
import { StyledInnerDialog } from '../components/StyledInnerDialog'

type Props = {
  selected: SelectedProfile
  onChangeSelected: (selected: SelectedProfile) => void
  onNext: () => void
  onBack: () => void
}
export const TransferOrResetProfileView = ({
  selected,
  onChangeSelected: onChangeShouldReset,
  onNext,
  onBack,
}: Props) => {
  const { t } = useTranslation('transactionFlow')

  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.warningOverlay.transferOrResetProfile.title')}
      />
      <StyledInnerDialog>
        <CenteredTypography>
          {t('input.profileEditor.warningOverlay.transferOrResetProfile.subtitle')}
        </CenteredTypography>
        <DetailedSwitch
          title="Transfer current profile"
          description="Unselecting this will reset your profile."
          checked={!selected}
          onChange={(e) => onChangeShouldReset(e.currentTarget.checked ? 'latest' : 'reset')}
        />
      </StyledInnerDialog>
      <Dialog.Footer
        leading={
          <Button
            colorStyle="accentSecondary"
            onClick={onBack}
            data-testid="warning-overlay-secondary-action"
          >
            {t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button onClick={onNext} data-testid="profile-editor-overlay-button">
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
