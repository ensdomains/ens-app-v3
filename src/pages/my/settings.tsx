import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Dialog } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { DevSection } from '@app/components/pages/profile/settings/DevSection'
import { PrimarySection } from '@app/components/pages/profile/settings/PrimarySection'
import { TransactionSection } from '@app/components/pages/profile/settings/TransactionSection'
import { WalletSection } from '@app/components/pages/profile/settings/WalletSection'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'

export type SettingsDialogProps = {
  actionLabel: string
  title: string
  description: string
  callBack: () => void
}

const OtherWrapper = styled.div(
  ({ theme }) => css`
    grid-area: other;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};
  `,
)

export default function Page() {
  const { t } = useTranslation('settings')
  const { address, isConnecting, isReconnecting } = useAccount()

  useProtectedRoute('/', isConnecting || isReconnecting ? true : address)

  const [dialogProps, setDialogProps] = useState<SettingsDialogProps | null>(null)

  return (
    <Content singleColumnContent title={t('title')}>
      {{
        trailing: (
          <>
            <OtherWrapper>
              <PrimarySection />
              <WalletSection />
              <TransactionSection onShowDialog={setDialogProps} />
              {process.env.NEXT_PUBLIC_PROVIDER && <DevSection />}
            </OtherWrapper>
            <Dialog
              open={!!dialogProps}
              variant="blank"
              onDismiss={() => setDialogProps(null)}
              onClose={() => setDialogProps(null)}
            >
              <Dialog.Heading alert="warning" title={dialogProps?.title} />
              <InnerDialog>{dialogProps?.description}</InnerDialog>
              <Dialog.Footer
                leading={
                  <Button
                    colorStyle="accentSecondary"
                    onClick={() => {
                      setDialogProps(null)
                    }}
                  >
                    {t('action.cancel', { ns: 'common' })}
                  </Button>
                }
                trailing={
                  <Button
                    onClick={() => {
                      dialogProps?.callBack()
                      setDialogProps(null)
                    }}
                  >
                    {dialogProps?.actionLabel}
                  </Button>
                }
              />
            </Dialog>
          </>
        ),
      }}
    </Content>
  )
}
