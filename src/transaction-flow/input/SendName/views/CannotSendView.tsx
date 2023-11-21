import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Typography } from '@ensdomains/thorin'

const CenteredTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

type Props = {
  onDismiss: () => void
}

export const CannotSendView = ({ onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading alert="error" title={t('input.sendName.views.error.title')} />
      <CenteredTypography>{t('input.sendName.views.error.description')}</CenteredTypography>
      <Dialog.Footer
        trailing={
          <Button colorStyle="redSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
