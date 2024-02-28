import { describe, expect, it } from 'vitest'
import { Connector } from 'wagmi'
import { safe, walletConnect } from 'wagmi/connectors'

import { checkIsSafeApp } from './safe'

describe('checkIsSafeApp', () => {
  it('should return false if connector is undefined', async () => {
    const result = await checkIsSafeApp(undefined)
    expect(result).toBe(false)
  })

  it('should return "iframe" if connector is a safe', async () => {
    const connector = safe({})({} as any) as Connector
    const result = await checkIsSafeApp(connector)
    expect(result).toBe('iframe')
  })

  it('should return "walletconnect" if connector is a walletConnect and connected to Safe app', async () => {
    const connector = walletConnect({ projectId: 'abcdef' })({} as any) as unknown as Connector

    connector.getProvider = async () => ({
      session: {
        peer: {
          metadata: {
            name: 'Safe',
            url: 'https://app.safe.global/',
          },
        },
      },
    })
    const result = await checkIsSafeApp(connector)
    expect(result).toBe('walletconnect')
  })

  it('should return false if connector is a WalletConnectConnector but not connected to Safe app', async () => {
    const connector = walletConnect({ projectId: 'abcdef' })({} as any) as unknown as Connector
    connector.getProvider = async () => ({
      session: {
        peer: {
          metadata: {
            name: 'WalletConnect',
            url: 'https://bridge.walletconnect.org/',
          },
        },
      },
    })
    const result = await checkIsSafeApp(connector)
    expect(result).toBe(false)
  })
})
