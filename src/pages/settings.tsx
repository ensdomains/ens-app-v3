import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Basic } from '@app/layouts/Basic'
import { Button, Typography } from '@ensdomains/thorin'
import type { NextPage } from 'next'
import { useAccount, useDisconnect } from 'wagmi'

const SettingsPage: NextPage = () => {
  const { data: addressData, isLoading, status } = useAccount()
  const { disconnect } = useDisconnect()
  const loading = isLoading || status === 'loading'

  useProtectedRoute('/', loading ? true : addressData)

  return (
    <Basic title="Settings -" loading={loading}>
      <Typography>Settings</Typography>
      <Button tone="red" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </Basic>
  )
}

export default SettingsPage
