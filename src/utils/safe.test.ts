import { SafeConnector } from 'wagmi/connectors/safe'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { checkIsSafeApp, SafeAppType } from './safe'

describe('checkIsSafeApp', () => {
  it('should return false if connector is undefined', async () => {
    const result = await checkIsSafeApp(undefined)
    expect(result).toBe(false)
  })

  it('should return "iframe" if connector is a SafeConnector', async () => {
    const connector = new SafeConnector('https://safe-client.safe.global')
    const result = await checkIsSafeApp(connector)
    expect(result).toBe('iframe')
  })

  it('should return "walletconnect" if connector is a WalletConnectConnector and connected to Safe app', async () => {
    const connector = Object.create(WalletConnectConnector.prototype)

    connector.getProvider = () => ({ session: {
        peer: {
            metadata: {
                name: 'Safe',
                url: 'https://app.safe.global/',
            },
        }
    } })
    const result = await checkIsSafeApp(connector)
    expect(result).toBe('walletconnect')
  })

  it('should return false if connector is a WalletConnectConnector but not connected to Safe app', async () => {
    const connector = Object.create(WalletConnectConnector.prototype)
    connector.getProvider = () => ({ session: {
        peer: {
            metadata: {
          name: 'WalletConnect',
          url: 'https://bridge.walletconnect.org/',
            },
        }
    } })
    const result = await checkIsSafeApp(connector)
    expect(result).toBe(false)
  })
})