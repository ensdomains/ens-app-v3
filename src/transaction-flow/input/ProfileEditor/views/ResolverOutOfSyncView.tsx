import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'

import { CenteredTypography } from '../components/CenteredTypography'
import { ContentContainer } from '../components/ContentContainer'
import { SkipButton } from '../components/SkipButton'
import { StyledInnerDialog } from '../components/StyledInnerDialog'

type Props = {
  onNext: () => void
  onCancel: () => void
  onSkip: () => void
}
export const ResolverOutOfSyncView = ({ onNext, onCancel, onSkip }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.warningOverlay.resolverOutOfSync.title')}
        alert="warning"
      />
      <StyledInnerDialog>
        <ContentContainer>
          <CenteredTypography>
            {t('input.profileEditor.warningOverlay.resolverOutOfSync.subtitle')}
          </CenteredTypography>
          <Outlink href="https://support.ens.domains/faq/manager/managing-names/#what-is-a-resolver">
            {t('input.profileEditor.warningOverlay.action.learnMoreResolvers')}
          </Outlink>
        </ContentContainer>
        <SkipButton
          data-testid="warning-overlay-skip-button"
          description={t('input.profileEditor.warningOverlay.action.ignoreUpdate')}
          actionLabel={t('action.skip', { ns: 'common' })}
          onClick={onSkip}
        />
      </StyledInnerDialog>
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
          <Button onClick={onNext} data-testid="warning-overlay-next-button">
            {t('input.profileEditor.warningOverlay.action.updateResolver')}
          </Button>
        }
      />
    </>
  )
}
