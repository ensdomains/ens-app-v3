import { reconnect } from '@wagmi/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { capsuleClient, capsuleModalProps, capsuleWalletConnectorFn } from './capsuleWallet'
import { loadCapsule } from './loadCapsule'
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

vi.mock('./capsuleWallet', () => ({
  capsuleClient: {},
  capsuleModalProps: {},
  capsuleWalletConnectorFn: vi.fn(),
}))

describe('loadCapsule', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should import capsuleWallet, set up the connector, and add it to wagmiConfig', async () => {
    const mockInitialisedConnector = { id: 'capsule-integrated' }
    wagmiConfig._internal.connectors.setup.mockReturnValue(mockInitialisedConnector)

    const result = await loadCapsule()

    expect(wagmiConfig._internal.connectors.setup).toHaveBeenCalledWith(capsuleWalletConnectorFn)
    expect(wagmiConfig._internal.connectors.setState).toHaveBeenCalled()
    expect(result).toEqual({
      capsuleClient: capsuleClient,
      capsuleModalProps: capsuleModalProps,
    })
  })

  it('should not attempt reconnection if shouldAttemptReconnect conditions are not met', async () => {
    localStorage.setItem(`${prefix}.recentConnectorId`, JSON.stringify('other-connector'))

    await loadCapsule()

    expect(wagmiConfig.subscribe).not.toHaveBeenCalled()
    expect(reconnect).not.toHaveBeenCalled()
  })

  it('should attempt reconnection if shouldAttemptReconnect conditions are met', async () => {
    localStorage.setItem(`${prefix}.recentConnectorId`, JSON.stringify('capsule-integrated'))
    localStorage.setItem(`${prefix}.capsule-integrated.connected`, 'true')
    wagmiConfig.state.status = 'disconnected'

    let subscriberCallback: (state: string) => void
    wagmiConfig.subscribe.mockImplementation((_, callback) => {
      subscriberCallback = callback
      return vi.fn() // Return a mock unsubscribe function
    })

    await loadCapsule()

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
    localStorage.setItem(`${prefix}.recentConnectorId`, JSON.stringify('capsule-integrated'))
    localStorage.setItem(`${prefix}.capsule-integrated.connected`, 'true')
    wagmiConfig.state.status = 'connected'

    await loadCapsule()

    expect(wagmiConfig.subscribe).not.toHaveBeenCalled()
    expect(reconnect).not.toHaveBeenCalled()
  })

  it('should add capsule connector and remove existing one with the same id', async () => {
    const mockInitialisedConnector = { id: 'capsule-integrated' }
    wagmiConfig._internal.connectors.setup.mockReturnValue(mockInitialisedConnector)

    await loadCapsule()

    expect(wagmiConfig._internal.connectors.setState).toHaveBeenCalledWith(expect.any(Function))
    const setStateCallback = wagmiConfig._internal.connectors.setState.mock.calls[0][0]
    const existingConnectors = [{ id: 'capsule-integrated' }, { id: 'other-connector' }]
    const newConnectors = setStateCallback(existingConnectors)
    expect(newConnectors).toEqual([{ id: 'other-connector' }, mockInitialisedConnector])
  })
})
