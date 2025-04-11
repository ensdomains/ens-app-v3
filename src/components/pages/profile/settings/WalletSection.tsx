import { useAccount, useConnections } from 'wagmi'

import { Box, Button, Card, Typography, WalletSVG } from '@ensdomains/thorin'

import RecordItem from '@app/components/RecordItem'
import { hasParaConnection } from '@app/utils/utils'

export const WalletSection = () => {
  const { address, connector } = useAccount()

  const connections = useConnections()
  const isParaConnected = hasParaConnection(connections)

  return (
    <Card>
      <Typography
        display="flex"
        fontVariant="headingFour"
        justifyContent="space-between"
        alignItems="center"
      >
        Wallet{' '}
      </Typography>
      <RecordItem type="address" itemKey="Address" value={address as string} />
      <Box
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
        justifyContent="space-between"
        gap="2"
      >
        <RecordItem type="text" itemKey="Connector" value={connector?.name as string} />
        {isParaConnected && (
          <Button
            width={{ base: 'full', sm: 'max' }}
            size="small"
            colorStyle="accentSecondary"
            prefix={() => <WalletSVG height={12} width={12} />}
            as="a"
            href="https://connect.getpara.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Go to wallet
          </Button>
        )}
      </Box>
    </Card>
  )
}
