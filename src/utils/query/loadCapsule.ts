import { reconnect } from '@wagmi/core'

import { prefix, wagmiConfig } from './wagmi'

const capsuleWalletId = 'capsule-integrated'

const shouldAttemptReconnect = () => {
  const recentConnectorId = localStorage.getItem(`${prefix}.recentConnectorId`)
  if (recentConnectorId !== `"${capsuleWalletId}"`) return false

  const connected = localStorage.getItem(`${prefix}.${capsuleWalletId}.connected`)
  return connected === 'true'
}

export const loadCapsule = async () => {
  const { capsuleClient, capsuleWalletConnectorFn, capsuleModalProps } = await import(
    /* webpackMode: "lazy" */
    /* webpackFetchPriority: "low" */
    './capsuleWallet'
  )

  const initialisedConnector = wagmiConfig._internal.connectors.setup(capsuleWalletConnectorFn)
  wagmiConfig._internal.connectors.setState((existingConnectors) => [
    ...existingConnectors.filter((c) => c.id !== capsuleWalletId),
    initialisedConnector,
  ])

  if (shouldAttemptReconnect() && wagmiConfig.state.status !== 'connected') {
    const unsubscribe = wagmiConfig.subscribe(
      (s) => s.status,
      (state) => {
        if (state === 'connected') unsubscribe()
        if (state !== 'disconnected') return

        unsubscribe()
        process.nextTick(() => reconnect(wagmiConfig, { connectors: [initialisedConnector] }))
      },
    )
  }

  return { capsuleClient, capsuleModalProps }
}
