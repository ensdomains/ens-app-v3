import { Button } from '@ensdomains/thorin'
import { useDisconnect } from 'wagmi'
import { SectionContainer, SectionHeading } from './Section'
import { useLoadedTranslation } from '../../hooks/useLoadedTranslation'

export const WalletSection = () => {
  const { t: tc } = useLoadedTranslation()
  const { t } = useLoadedTranslation('settings')
  const { disconnect } = useDisconnect()

  return (
    <SectionContainer>
      <SectionHeading variant="large" weight="bold">
        {t('section.wallet.title')}
      </SectionHeading>
      <div data-testid="wallet-section-disconnect" style={{ width: '100%' }}>
        <Button tone="red" onClick={() => disconnect()}>
          {tc('wallet.disconnect')}
        </Button>
      </div>
    </SectionContainer>
  )
}
