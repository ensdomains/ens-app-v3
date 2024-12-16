import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { Button, Toast } from '@ensdomains/thorin'

import { shouldOpenModal } from './utils'

const appLinks = {
  ethereum: 'app.ens.domains',
  sepolia: 'sepolia.app.ens.domains',
  holesky: 'holesky.app.ens.domains',
}

export const NetworkNotifications = () => {
  const { t } = useTranslation()
  const account = useAccount()
  const [open, setOpen] = useState<boolean | undefined>(undefined)

  const connectedChainName = account?.chain?.name
  const connectedChainId = account?.chain?.id

  useEffect(() => {
    setOpen(shouldOpenModal(connectedChainName, connectedChainId))
  }, [connectedChainName, connectedChainId])

  return (
    <Toast
      description={t(`networkNotifications.${connectedChainName}.description`)}
      open={open}
      title={t(`networkNotifications.${connectedChainName}.title`)}
      variant="desktop"
      onClose={() => setOpen(false)}
    >
      <Button
        size="small"
        as="a"
        href={`https://${appLinks[connectedChainName?.toLocaleLowerCase()]}`}
      >
        {t(`networkNotifications.${connectedChainName}.action`)}
      </Button>
    </Toast>
  )
}
