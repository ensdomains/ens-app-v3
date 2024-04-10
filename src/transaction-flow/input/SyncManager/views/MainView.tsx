import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Helper, Typography } from '@ensdomains/thorin'

import { TransComponentName } from '@app/components/@atoms/Name2/Name'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[4]};
  `,
)

const Description = styled.div(
  () => css`
    text-align: center;
    width: 100%;
    position: relative;
    overflow: hidden;
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
    <Container>
      <Description>
        <Typography color="text">
          <Trans
            t={t}
            i18nKey="input.syncManager.description"
            values={{ manager }}
            components={{
              nameComponent: <TransComponentName type="wrap" wrapLines={2} minInitialWidth={100} />,
            }}
          />
        </Typography>
      </Description>
      {showWarning && <Helper type="warning">{t('input.syncManager.warning')}</Helper>}
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onCancel}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={<Button onClick={onConfirm}>{t('action.next', { ns: 'common' })}</Button>}
      />
    </Container>
  )
}
