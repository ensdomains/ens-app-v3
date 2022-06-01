import { Button } from '@ensdomains/thorin'
import { useDisconnect } from 'wagmi'
import { SectionContainer, SectionHeading } from './Section'

export const WalletSection = () => {
  const { disconnect } = useDisconnect()

  return (
    <SectionContainer>
      <SectionHeading variant="large" weight="bold">
        Wallet
      </SectionHeading>
      <Button tone="red" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </SectionContainer>
  )
}
