import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { Button, Toast } from '@ensdomains/thorin'

import { shouldOpenModal } from './utils'
import { useChainId } from 'wagmi'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useRouter } from 'next/router'

const appLinks = {
  Ethereum: 'app.ens.domains',
  Sepolia: 'sepolia.app.ens.domains',
  Holesky: 'holesky.app.ens.domains',
  Localhost: '',
}

export const NetworkNotifications = () => {
  const { t } = useTranslation()
  const account = useAccount()
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)

  const connectedChainName = account?.chain?.name
  const connectedChainId = account?.chain?.id

  const chain = useChainId()

  console.log('account', account)
  console.log('connectedChainName', connectedChainName, chain)

  useEffect(() => {
    setOpen(shouldOpenModal(connectedChainName, connectedChainId))
  }, [connectedChainName, connectedChainId])

  if (!connectedChainName || !router.isReady) return null

  return (
    <Toast
      description={t(`networkNotifications.${connectedChainName}.description`)}
      open={open}
      title={t(`networkNotifications.${connectedChainName}.title`)}
      variant="desktop"
      onClose={() => setOpen(false)}
    >
      <Button size="small" as="a" href={`https://${appLinks[connectedChainName]}`}>
        {t(`networkNotifications.${connectedChainName}.action`)}
      </Button>
    </Toast>
  )
}
