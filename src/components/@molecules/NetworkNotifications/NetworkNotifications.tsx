import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useChainId } from 'wagmi'

import { Button, Toast } from '@ensdomains/thorin'

import { getSupportedChainById } from '@app/constants/chains'

import { shouldOpenModal } from './utils'

const appLinks = {
  Ethereum: 'app.ens.domains',
  Sepolia: 'sepolia.app.ens.domains',
  Holesky: 'holesky.app.ens.domains',
  Localhost: '',
}

export const NetworkNotifications = () => {
  const { t } = useTranslation()
  const account = useAccount()
  const connectedChainId = useChainId()
  const [open, setOpen] = useState<boolean>(false)

  const accountChainId = account?.chainId

  useEffect(() => {
    setOpen(shouldOpenModal(connectedChainId, accountChainId))
  }, [connectedChainId, accountChainId])

  const accountChainName = getSupportedChainById(accountChainId)?.name
  if (!accountChainName) return null

  return (
    <Toast
      description={t(`networkNotifications.${accountChainName}.description`)}
      open={open}
      title={t(`networkNotifications.${accountChainName}.title`)}
      variant="desktop"
      onClose={() => setOpen(false)}
    >
      <Button size="small" as="a" href={`https://${appLinks[accountChainName]}`}>
        {t(`networkNotifications.${accountChainName}.action`)}
      </Button>
    </Toast>
  )
}
