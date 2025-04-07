import { reconnect } from '@wagmi/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { loadPara } from './loadPara'
import { paraClient, paraModalProps, paraWalletConnectorFn } from './paraWallet'
import { prefix, wagmiConfig } from './wagmi'

// Mock the external dependencies
vi.mock('@wagmi/core', () => ({
  reconnect: vi.fn(),
}))

vi.mock('./wagmi', () => ({
  prefix: 'test-prefix',
  wagmiConfig: {
    _internal: {
      connectors: {
        setup: vi.fn(),
        setState: vi.fn(),
      },
    },
    state: {
      status: 'disconnected',
    },
    subscribe: vi.fn(),
  },
}))

vi.mock('./paraWallet', () => ({
  paraClient: {},
  paraModalProps: {},
  paraWalletConnectorFn: vi.fn(),
}))

describe('loadPara', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should import paraWallet, set up the connector, and add it to wagmiConfig', async () => {
    const mockInitialisedConnector = { id: 'para-integrated' }
    wagmiConfig._internal.connectors.setup.mockReturnValue(mockInitialisedConnector)

    const result = await loadPara()

    expect(wagmiConfig._internal.connectors.setup).toHaveBeenCalledWith(paraWalletConnectorFn)
    expect(wagmiConfig._internal.connectors.setState).toHaveBeenCalled()
    expect(result).toEqual({
      paraClient: paraClient,
      paraModalProps: paraModalProps,
    })
  })

  it('should not attempt reconnection if shouldAttemptReconnect conditions are not met', async () => {
    localStorage.setItem(`${prefix}.recentConnectorId`, JSON.stringify('other-connector'))

    await loadPara()

    expect(wagmiConfig.subscribe).not.toHaveBeenCalled()
    expect(reconnect).not.toHaveBeenCalled()
  })

  it('should attempt reconnection if shouldAttemptReconnect conditions are met', async () => {
    localStorage.setItem(`${prefix}.recentConnectorId`, JSON.stringify('para-integrated'))
    localStorage.setItem(`${prefix}.para-integrated.connected`, 'true')
    wagmiConfig.state.status = 'disconnected'

    let subscriberCallback: (state: string) => void
    wagmiConfig.subscribe.mockImplementation((_, callback) => {
      subscriberCallback = callback
      return vi.fn() // Return a mock unsubscribe function
    })

    await loadPara()

    expect(wagmiConfig.subscribe).toHaveBeenCalled()

    // Simulate state changes
    subscriberCallback('disconnected')

    // Run all microtasks (including process.nextTick)
    vi.useFakeTimers()
    vi.runAllTicks()

    // Wait for reconnect to be called
    await vi.waitFor(() => {
      expect(reconnect).toHaveBeenCalled()
    })

    subscriberCallback('connected')
    expect(wagmiConfig.subscribe).toHaveBeenCalledTimes(1) // Ensure unsubscribe was called
  })

  it('should not attempt reconnection if already connected', async () => {
    localStorage.setItem(`${prefix}.recentConnectorId`, JSON.stringify('para-integrated'))
    localStorage.setItem(`${prefix}.para-integrated.connected`, 'true')
    wagmiConfig.state.status = 'connected'

    await loadPara()

    expect(wagmiConfig.subscribe).not.toHaveBeenCalled()
    expect(reconnect).not.toHaveBeenCalled()
  })

  it('should add para connector and remove existing one with the same id', async () => {
    const mockInitialisedConnector = { id: 'para-integrated' }
    wagmiConfig._internal.connectors.setup.mockReturnValue(mockInitialisedConnector)

    await loadPara()

    expect(wagmiConfig._internal.connectors.setState).toHaveBeenCalledWith(expect.any(Function))
    const setStateCallback = wagmiConfig._internal.connectors.setState.mock.calls[0][0]
    const existingConnectors = [{ id: 'para-integrated' }, { id: 'other-connector' }]
    const newConnectors = setStateCallback(existingConnectors)
    expect(newConnectors).toEqual([mockInitialisedConnector, { id: 'other-connector' }])
  })
})
