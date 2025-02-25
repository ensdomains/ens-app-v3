import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Helper, Typography } from '@ensdomains/thorin'

const Description = styled.div(
  () => css`
    text-align: center;
  `,
)

type Props = {
  manager: string
  showWarning: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const MainView = ({ manager, showWarning, onCancel, onConfirm }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Content>
        <Description>
          <Typography color="text">
            <Trans t={t} i18nKey="input.syncManager.description" values={{ manager }} />
          </Typography>
        </Description>
        {showWarning && <Helper alert="warning">{t('input.syncManager.warning')}</Helper>}
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onCancel}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={<Button onClick={onConfirm}>{t('action.next', { ns: 'common' })}</Button>}
      />
    </>
  )
}
