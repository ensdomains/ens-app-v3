import { Button } from '@ensdomains/thorin'
import { useDisconnect } from 'wagmi'
import { SectionContainer, SectionHeading } from './Section'
import { useLoadedTranslation } from '../../hooks/useLoadedTranslation'

export const WalletSection = () => {
  const { t } = useLoadedTranslation(['common', 'settings'])
  const { disconnect } = useDisconnect()

  return (
    <SectionContainer>
      <SectionHeading variant="large" weight="bold">
        {t('section.wallet.title', { ns: 'settings' })}
      </SectionHeading>
      <div data-testid="wallet-section-disconnect" style={{ width: '100%' }}>
        <Button tone="red" onClick={() => disconnect()}>
          {t('wallet.disconnect')}
        </Button>
      </div>
    </SectionContainer>
  )
}
