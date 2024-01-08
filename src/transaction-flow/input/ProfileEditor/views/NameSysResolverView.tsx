import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'
import { makeNameSysLink } from '@app/utils/utils'

import { CenteredTypography } from '../components/CenteredTypography'
import { ContentContainer } from '../components/ContentContainer'
import { StyledInnerDialog } from '../components/StyledInnerDialog'

type Props = {
  onCancel?: () => void
}
export const NameSysResolverView = ({ onCancel }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.warningOverlay.namesysResolver.title')}
        alert="error"
      />
      <StyledInnerDialog>
        <ContentContainer>
          <CenteredTypography>
            {t('input.profileEditor.warningOverlay.namesysResolver.subtitle')}
          </CenteredTypography>
          <Outlink href={makeNameSysLink()}>
            {t('input.profileEditor.warningOverlay.action.visitNameSysClient')}
          </Outlink>
        </ContentContainer>
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
          <Button onClick={onCancel} data-testid="warning-overlay-back-button">
            {t('input.profileEditor.warningOverlay.action.goBack')}
          </Button>
        }
      />
    </>
  )
}
