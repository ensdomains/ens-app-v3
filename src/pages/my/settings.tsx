import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Dialog } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { DevSection } from '@app/components/pages/profile/settings/DevSection'
import { PrimarySection } from '@app/components/pages/profile/settings/PrimarySection'
import { TransactionSection } from '@app/components/pages/profile/settings/TransactionSection'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'
import { useGlobalErrorDispatch } from '@app/utils/GlobalErrorProvider/GlobalErrorProvider'

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

const StyledInnerDialog = styled(InnerDialog)(
  () => css`
    text-align: center;
  `,
)

export default function Page() {
  const { t } = useTranslation('settings')
  const { address, isConnecting, isReconnecting } = useAccount()

  // There are no subgraph calls on the settings page so we need to force
  // an update in order to know if there is an error
  const globalErrorDispatch = useGlobalErrorDispatch()
  useEffect(() => {
    globalErrorDispatch({
      type: 'SET_META',
      payload: {
        forceUpdate: true,
      },
    })
    return () => {
      globalErrorDispatch({
        type: 'SET_META',
        payload: {
          forceUpdate: false,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useProtectedRoute('/', isConnecting || isReconnecting ? true : address)

  const [dialogProps, setDialogProps] = useState<SettingsDialogProps | null>(null)
  const showDevPanel =
    process.env.NEXT_PUBLIC_ENSJS_DEBUG ||
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_PROVIDER

  return (
    <Content singleColumnContent title={t('title')}>
      {{
        trailing: (
          <>
            <OtherWrapper>
              <PrimarySection />
              <TransactionSection onShowDialog={setDialogProps} />
              {showDevPanel && <DevSection />}
            </OtherWrapper>
            <Dialog
              open={!!dialogProps}
              variant="blank"
              onDismiss={() => setDialogProps(null)}
              onClose={() => setDialogProps(null)}
            >
              <Dialog.Heading alert="warning" title={dialogProps?.title} />
              <StyledInnerDialog>{dialogProps?.description}</StyledInnerDialog>
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
                    {dialogProps?.actionLabel || t('action.next', { ns: 'common' })}
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
