import { localhost, mainnet, sepolia } from 'viem/chains'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getChainsFromUrl,
  getNetworkFromUrl,
  getSupportedChainById,
  localhostWithEns,
  mainnetWithEns,
  sepoliaWithEns,
} from './chains'

// Store original values
const originalWindow = global.window
const originalEnv = process.env

// Create a mock location object
const createMockLocation = (hostname: string) => ({
  hostname,
  href: `https://${hostname}`,
  origin: `https://${hostname}`,
  protocol: 'https:',
  host: hostname,
  pathname: '/',
  search: '',
  hash: '',
})

describe('chains', () => {
  beforeEach(() => {
    // Reset environment
    process.env = { ...originalEnv }
    delete process.env.NEXT_PUBLIC_CHAIN_NAME
    delete process.env.NEXT_PUBLIC_PROVIDER
    
    // Set up window mock
    Object.defineProperty(global, 'window', {
      value: {
        location: createMockLocation('app.ens.domains'),
      },
      writable: true,
    })
  })

  afterEach(() => {
    // Restore original values
    global.window = originalWindow
    process.env = originalEnv
  })

  describe('getSupportedChainById', () => {
    it('should return mainnet chain for mainnet id', () => {
      const result = getSupportedChainById(mainnet.id)
      expect(result).toBe(mainnetWithEns)
    })

    it('should return sepolia chain for sepolia id', () => {
      const result = getSupportedChainById(sepolia.id)
      expect(result).toBe(sepoliaWithEns)
    })

    it('should return localhost chain for localhost id', () => {
      const result = getSupportedChainById(localhost.id)
      expect(result).toBe(localhostWithEns)
    })

    it('should return undefined for unsupported chain id', () => {
      const result = getSupportedChainById(9999)
      expect(result).toBeUndefined()
    })

    it('should return undefined for undefined chain id', () => {
      const result = getSupportedChainById(undefined)
      expect(result).toBeUndefined()
    })
  })

  describe('getNetworkFromUrl', () => {
    it('should return undefined in server-side environment', () => {
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
      })
      const result = getNetworkFromUrl()
      expect(result).toBeUndefined()
    })

    describe('environment variable overrides', () => {
      it('should return sepolia when NEXT_PUBLIC_CHAIN_NAME is sepolia', () => {
        process.env.NEXT_PUBLIC_CHAIN_NAME = 'sepolia'
        const result = getNetworkFromUrl()
        expect(result).toBe('sepolia')
      })

      it('should return mainnet when NEXT_PUBLIC_CHAIN_NAME is mainnet', () => {
        process.env.NEXT_PUBLIC_CHAIN_NAME = 'mainnet'
        const result = getNetworkFromUrl()
        expect(result).toBe('mainnet')
      })
    })

    describe('hostname-based detection', () => {
      // SNRC dropped the ENS-specific hostname branches (app.ens.domains,
      // sepolia.app.ens.domains, *.ens-app-v3.pages.dev). The only
      // hostname-driven path left is `localhost` / `127.0.0.1`, which
      // resolves to either 'localhost' (with NEXT_PUBLIC_PROVIDER set) or
      // 'sepolia' (without). Any other hostname returns undefined and
      // requires NEXT_PUBLIC_CHAIN_NAME to disambiguate.
      it('should return localhost for localhost with local provider', async () => {
        process.env.NEXT_PUBLIC_PROVIDER = 'http://localhost:8545'
        // @ts-ignore
        global.window.location = createMockLocation('localhost')
        vi.resetModules()
        const { getNetworkFromUrl: getNetworkFromUrlFresh } = await import('./chains')
        expect(getNetworkFromUrlFresh()).toBe('localhost')
      })

      it('should return sepolia for localhost without local provider', async () => {
        delete process.env.NEXT_PUBLIC_PROVIDER
        // @ts-ignore
        global.window.location = createMockLocation('localhost')
        vi.resetModules()
        const { getNetworkFromUrl: getNetworkFromUrlFresh } = await import('./chains')
        expect(getNetworkFromUrlFresh()).toBe('sepolia')
      })

      it('should return localhost for 127.0.0.1 with local provider', async () => {
        process.env.NEXT_PUBLIC_PROVIDER = 'http://localhost:8545'
        // @ts-ignore
        global.window.location = createMockLocation('127.0.0.1')
        vi.resetModules()
        const { getNetworkFromUrl: getNetworkFromUrlFresh } = await import('./chains')
        expect(getNetworkFromUrlFresh()).toBe('localhost')
      })

      it('should return sepolia for 127.0.0.1 without local provider', async () => {
        delete process.env.NEXT_PUBLIC_PROVIDER
        // @ts-ignore
        global.window.location = createMockLocation('127.0.0.1')
        vi.resetModules()
        const { getNetworkFromUrl: getNetworkFromUrlFresh } = await import('./chains')
        expect(getNetworkFromUrlFresh()).toBe('sepolia')
      })

      it('should return undefined for any non-local hostname when no env var is set', () => {
        // @ts-ignore
        global.window.location = createMockLocation('unknown.example.com')
        expect(getNetworkFromUrl()).toBeUndefined()
      })
    })
  })

  describe('getChainsFromUrl', () => {
    it('should return mainnet chains when NEXT_PUBLIC_CHAIN_NAME=mainnet', () => {
      process.env.NEXT_PUBLIC_CHAIN_NAME = 'mainnet'
      const result = getChainsFromUrl()
      expect(result).toEqual([mainnetWithEns])
    })

    it('should return sepolia chains when NEXT_PUBLIC_CHAIN_NAME=sepolia', () => {
      process.env.NEXT_PUBLIC_CHAIN_NAME = 'sepolia'
      const result = getChainsFromUrl()
      expect(result).toEqual([sepoliaWithEns])
    })

    it('should return localhost chains for localhost network', async () => {
      process.env.NEXT_PUBLIC_PROVIDER = 'http://localhost:8545'
      // @ts-ignore
      global.window.location = createMockLocation('localhost')

      vi.resetModules()
      const { getChainsFromUrl: getChainsFromUrlFresh, localhostWithEns: localhostWithEnsFresh } = await import('./chains')
      const result = getChainsFromUrlFresh()
      expect(result).toEqual([localhostWithEnsFresh])
    })

    it('should fall back to sepolia for undefined network', () => {
      // SNRC default fallback: when neither NEXT_PUBLIC_CHAIN_NAME nor a
      // localhost hostname identifies the network, the dApp serves sepolia
      // since that's where .testing originally lives in test environments.
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
      })
      expect(getChainsFromUrl()).toMatchObject([sepoliaWithEns])
    })
  })

  describe('chain configurations', () => {
    it('should keep the correct chain ids', () => {
      expect(mainnetWithEns.id).toBe(mainnet.id)
      expect(sepoliaWithEns.id).toBe(sepolia.id)
      expect(localhostWithEns.id).toBe(localhost.id)
    })

    it('should reflect SNRC addresses on sepolia (parsed from env)', () => {
      // sepoliaWithEns is built from `sepoliaDeploymentAddresses` (parsed
      // from NEXT_PUBLIC_SEPOLIA_DEPLOYMENT_ADDRESSES at module load
      // time). In tests the env var is unset so the bundle is empty, but
      // the override hook should still be wired up — the canonical ENS
      // Sepolia controller address must NOT leak through.
      expect(sepoliaWithEns.contracts.ensEthRegistrarController?.address).not.toBe(
        '0xfb3cE5D01e0f33f41DbB39035dB9745962F1f968',
      )
    })
  })
})