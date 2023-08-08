import { SafeConnector } from 'wagmi/connectors/safe'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { checkIsSafeApp, SafeAppType } from './safe'
import { WC_PROJECT_ID } from './constants'

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

  it.skip('should return "walletconnect" if connector is a WalletConnectConnector and connected to Safe app', async () => {
        new WalletConnectConnector({
            options: {
              projectId: WC_PROJECT_ID,
            },
          })
    const connector = new WalletConnectConnector({
      rpc: { 1: 'https://mainnet.infura.io/v3/1234567890abcdef' },
      bridge: 'https://bridge.walletconnect.org',
      qrcode: true,
      pollingInterval: 12000,
      options: {
        projectId: WC_PROJECT_ID,
        showQrModal: false
      }
    })

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

  it.skip('should return false if connector is a WalletConnectConnector but not connected to Safe app', async () => {
    const connector = new WalletConnectConnector({
      rpc: { 1: 'https://mainnet.infura.io/v3/1234567890abcdef' },
      bridge: 'https://bridge.walletconnect.org',
      qrcode: true,
      pollingInterval: 12000,
    })
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