import { Button } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import { useDisconnect } from 'wagmi'
import { SectionContainer, SectionHeading } from './Section'

export const WalletSection = () => {
  const { t } = useTranslation()

  const { disconnect } = useDisconnect()

  return (
    <SectionContainer>
      <SectionHeading variant="large" weight="bold">
        {t('settings.section.wallet.title')}
      </SectionHeading>
      <div data-testid="wallet-section-disconnect" style={{ width: '100%' }}>
        <Button tone="red" onClick={() => disconnect()}>
          {t('wallet.disconnect')}
        </Button>
      </div>
    </SectionContainer>
  )
}
