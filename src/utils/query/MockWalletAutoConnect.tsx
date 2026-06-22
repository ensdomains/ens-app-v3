import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

import { MOCK_CONNECTOR_ID } from './mockWallet'

/**
 * Test-only: keeps the mock wallet connected.
 *
 * wagmi's `mock` connector tracks its connection only in an in-memory `connected`
 * flag, which resets to `false` on every page load. As a result `isAuthorized()`
 * always returns `false` on a fresh load, so wagmi's `reconnectOnMount` can never
 * restore the mock session across a reload or hard navigation.
 *
 * To get tarmac-style behaviour (connection persists, transactions run without any
 * signing UI), we re-establish the connection programmatically whenever it isn't
 * connected. This also lets a browser-driving test agent skip the connect modal
 * entirely — the app boots already connected.
 *
 * Only mounted when `NEXT_PUBLIC_USE_MOCK_WALLET === 'true'` (see providers.tsx).
 */
export const MockWalletAutoConnect = () => {
  const { status } = useAccount()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    // status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected'
    if (status !== 'disconnected') return
    const mockConnector = connectors.find((connector) => connector.id === MOCK_CONNECTOR_ID)
    if (mockConnector) connect({ connector: mockConnector })
  }, [status, connect, connectors])

  return null
}
