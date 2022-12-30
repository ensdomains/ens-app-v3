import { useTranslation } from 'react-i18next'
import { useDisconnect } from 'wagmi'

import { Button } from '@ensdomains/thorin'

import { SectionContainer } from './Section'

export const WalletSection = () => {
  const { t: tc } = useTranslation()
  const { t } = useTranslation('settings')

  const { disconnect } = useDisconnect()

  return (
    <SectionContainer
      title={t('section.wallet.title')}
      action={
        <Button
          data-testid="wallet-section-disconnect"
          size="small"
          color="red"
          colorScheme="secondary"
          onClick={() => disconnect()}
        >
          {tc('wallet.disconnect')}
        </Button>
      }
      fill
    >
      {null}
    </SectionContainer>
  )
}
