import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Toast } from '@ensdomains/thorin'

import { getChainsFromUrl, getSupportedChainById } from '@app/constants/chains'

const appLinks = {
  ethereum: 'app.ens.domains',
  sepolia: 'sepolia.app.ens.domains',
  holesky: 'holesky.app.ens.domains',
}

export const NetworkNotifications = () => {
  const { t } = useTranslation()
  const account = useAccount()
  const [open, setOpen] = useState(false)

  const connectedChainName = account?.chain?.name
  const connectedChainId = account?.chain?.id

  console.log('connectedChainName: ', connectedChainName)

  useEffect(() => {
    if (!connectedChainName) return
    if (!getSupportedChainById(connectedChainId)) return

    const currentChain = getChainsFromUrl()?.[0]
    if (currentChain?.id !== connectedChainId) {
      setOpen(true)
    }
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
        onClick={() =>
          (window.location.href = `https://${appLinks[connectedChainName?.toLocaleLowerCase()]}`)
        }
      >
        {t(`networkNotifications.${connectedChainName}.action`)}
      </Button>
    </Toast>
  )
}
