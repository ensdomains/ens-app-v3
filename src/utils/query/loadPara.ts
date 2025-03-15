import { Connector, reconnect } from '@wagmi/core'

import { prefix, wagmiConfig } from './wagmi'

const paraWalletId = 'para-integrated'

const shouldAttemptReconnect = () => {
  const recentConnectorId = localStorage.getItem(`${prefix}.recentConnectorId`)
  if (recentConnectorId !== `"${paraWalletId}"`) return false

  const connected = localStorage.getItem(`${prefix}.${paraWalletId}.connected`)
  return connected === 'true'
}

const addParaConnector = (connector: Connector) => {
  wagmiConfig._internal.connectors.setState((existingConnectors) => [
    connector,
    ...existingConnectors.filter((c) => c.id !== paraWalletId),
  ])
}

const attemptReconnect = (initialisedParaConnector: Connector) => {
  if (shouldAttemptReconnect() && wagmiConfig.state.status !== 'connected') {
    const unsubscribe = wagmiConfig.subscribe(
      (s) => s.status,
      (state) => {
        if (state === 'connected') unsubscribe()
        if (state !== 'disconnected') return

        unsubscribe()
        process.nextTick(() => reconnect(wagmiConfig, { connectors: [initialisedParaConnector] }))
      },
    )
  }
}

export const loadPara = async () => {
  const { paraClient, paraWalletConnectorFn, paraModalProps } = await import(
    /* webpackMode: "lazy" */
    /* webpackFetchPriority: "low" */
    './paraWallet'
  )

  const initialisedParaConnector = wagmiConfig._internal.connectors.setup(paraWalletConnectorFn)

  addParaConnector(initialisedParaConnector)
  attemptReconnect(initialisedParaConnector)

  return { paraClient, paraModalProps }
}
