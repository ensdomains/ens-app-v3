import { Button } from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'
import { useDisconnect } from 'wagmi'
import { SectionContainer, SectionHeading } from './Section'

export const WalletSection = () => {
  const { t: tc } = useTranslation()
  const { t } = useTranslation('settings')

  const { disconnect } = useDisconnect()

  return (
    <SectionContainer>
      <SectionHeading variant="large" weight="bold">
        {t('section.wallet.title')}
      </SectionHeading>
      <Button tone="red" onClick={() => disconnect()}>
        {tc('wallet.disconnect')}
      </Button>
    </SectionContainer>
  )
}
