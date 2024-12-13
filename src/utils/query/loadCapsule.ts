import { Connector, reconnect } from '@wagmi/core'

import { prefix, wagmiConfig } from './wagmi'

const capsuleWalletId = 'capsule-integrated'

const shouldAttemptReconnect = () => {
  const recentConnectorId = localStorage.getItem(`${prefix}.recentConnectorId`)
  if (recentConnectorId !== `"${capsuleWalletId}"`) return false

  const connected = localStorage.getItem(`${prefix}.${capsuleWalletId}.connected`)
  return connected === 'true'
}

const addCapsuleConnector = (connector: Connector) => {
  wagmiConfig._internal.connectors.setState((existingConnectors) => [
    ...existingConnectors.filter((c) => c.id !== capsuleWalletId),
    connector,
  ])
}

const attemptReconnect = (initialisedCapsuleConnector: Connector) => {
  if (shouldAttemptReconnect() && wagmiConfig.state.status !== 'connected') {
    const unsubscribe = wagmiConfig.subscribe(
      (s) => s.status,
      (state) => {
        if (state === 'connected') unsubscribe()
        if (state !== 'disconnected') return

        unsubscribe()
        process.nextTick(() =>
          reconnect(wagmiConfig, { connectors: [initialisedCapsuleConnector] }),
        )
      },
    )
  }
}

export const loadCapsule = async () => {
  const { capsuleClient, capsuleWalletConnectorFn, capsuleModalProps } = await import(
    /* webpackMode: "lazy" */
    /* webpackFetchPriority: "low" */
    './capsuleWallet'
  )

  const initialisedCapsuleConnector =
    wagmiConfig._internal.connectors.setup(capsuleWalletConnectorFn)

  addCapsuleConnector(initialisedCapsuleConnector)
  attemptReconnect(initialisedCapsuleConnector)

  return { capsuleClient, capsuleModalProps }
}
