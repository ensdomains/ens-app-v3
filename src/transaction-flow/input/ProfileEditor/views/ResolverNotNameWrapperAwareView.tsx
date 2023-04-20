import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'

import { CenteredTypography } from '../components/CenteredTypography'
import { ContentContainer } from '../components/ContentContainer'
import { StyledInnerDialog } from '../components/StyledInnerDialog'

type Props = {
  onCancel?: () => void
  onNext?: () => void
}
export const ResolverNotNameWrapperAwareView = ({ onNext, onCancel }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.warningOverlay.resolverNotNameWrapperAware.title')}
        alert="error"
      />
      <StyledInnerDialog>
        <ContentContainer>
          <CenteredTypography>
            {t('input.profileEditor.warningOverlay.resolverNotNameWrapperAware.subtitle')}
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
          <Button onClick={onNext} data-testid="profile-editor-overlay-button">
            {t('input.profileEditor.warningOverlay.action.updateResolver')}
          </Button>
        }
      />
    </>
  )
}
