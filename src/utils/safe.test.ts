import { safe,walletConnect } from 'wagmi/connectors'

import { checkIsSafeApp } from './safe'
import { Connector, CreateConnectorFn } from 'wagmi'
import { WalletConnectProvider } from '@app/types'

describe('checkIsSafeApp', () => {
  it('should return false if connector is undefined', async () => {
    const result = await checkIsSafeApp(undefined)
    expect(result).toBe(false)
  })

  it('should return "iframe" if connector is a SafeConnector', async () => {
    const connector = safe()({} as any)
    const result = await checkIsSafeApp(connector as Connector)
    expect(result).toBe('iframe')
  })

  it('should return "walletconnect" if connector is a WalletConnectConnector and connected to Safe app', async () => {
    const connector = {id:'walletConnect'} as ReturnType<CreateConnectorFn<WalletConnectProvider>>

    connector.getProvider = async () => ({
      session: {
        peer: {
          metadata: {
            name: 'Safe',
            url: 'https://app.safe.global/',
          },
        },
      },
    } as WalletConnectProvider)
    const result = await checkIsSafeApp(connector as Connector)
    expect(result).toBe('walletconnect')
  })

  it('should return false if connector is a WalletConnectConnector but not connected to Safe app', async () => {
    const connector = {id:'walletConnect'} as ReturnType<CreateConnectorFn<WalletConnectProvider>>
    connector.getProvider = async () => ({
      session: {
        peer: {
          metadata: {
            name: 'WalletConnect',
            url: 'https://bridge.walletconnect.org/',
          },
        },
      },
    } as WalletConnectProvider)
    const result = await checkIsSafeApp(connector as Connector)
    expect(result).toBe(false)
  })
})
