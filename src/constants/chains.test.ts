import { holesky, localhost, mainnet, sepolia } from 'viem/chains'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getChainsFromUrl,
  getNetworkFromUrl,
  getSupportedChainById,
  holeskyWithEns,
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

    it('should return holesky chain for holesky id', () => {
      const result = getSupportedChainById(holesky.id)
      expect(result).toBe(holeskyWithEns)
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
      it('should return holesky when NEXT_PUBLIC_CHAIN_NAME is holesky', () => {
        process.env.NEXT_PUBLIC_CHAIN_NAME = 'holesky'
        const result = getNetworkFromUrl()
        expect(result).toBe('holesky')
      })

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
      it('should return mainnet for test.app.ens.domains', () => {
        // @ts-ignore
        global.window.location = createMockLocation('test.app.ens.domains')
        const result = getNetworkFromUrl()
        expect(result).toBe('mainnet')
      })

      it('should return sepolia for preview URLs ending with ens-app-v3.pages.dev', () => {
        // @ts-ignore
        global.window.location = createMockLocation('abc.ens-app-v3.pages.dev')
        const result = getNetworkFromUrl()
        expect(result).toBe('sepolia')
      })

      it('should return localhost for localhost with local provider', async () => {
        // Set up environment before importing
        process.env.NEXT_PUBLIC_PROVIDER = 'http://localhost:8545'
        // @ts-ignore
        global.window.location = createMockLocation('localhost')

        // Re-import the module to pick up the new environment variable
        vi.resetModules()
        const { getNetworkFromUrl: getNetworkFromUrlFresh } = await import('./chains')
        const result = getNetworkFromUrlFresh()
        expect(result).toBe('localhost')
      })

      it('should return sepolia for localhost without local provider', async () => {
        delete process.env.NEXT_PUBLIC_PROVIDER
        // @ts-ignore
        global.window.location = createMockLocation('localhost')

        // Re-import the module to pick up the cleared environment variable
        vi.resetModules()
        const { getNetworkFromUrl: getNetworkFromUrlFresh } = await import('./chains')
        const result = getNetworkFromUrlFresh()
        expect(result).toBe('sepolia')
      })

      it('should return localhost for 127.0.0.1 with local provider', async () => {
        process.env.NEXT_PUBLIC_PROVIDER = 'http://localhost:8545'
        // @ts-ignore
        global.window.location = createMockLocation('127.0.0.1')

        vi.resetModules()
        const { getNetworkFromUrl: getNetworkFromUrlFresh } = await import('./chains')
        const result = getNetworkFromUrlFresh()
        expect(result).toBe('localhost')
      })

      it('should return sepolia for 127.0.0.1 without local provider', async () => {
        delete process.env.NEXT_PUBLIC_PROVIDER
        // @ts-ignore
        global.window.location = createMockLocation('127.0.0.1')

        vi.resetModules()
        const { getNetworkFromUrl: getNetworkFromUrlFresh } = await import('./chains')
        const result = getNetworkFromUrlFresh()
        expect(result).toBe('sepolia')
      })

      it('should return sepolia for sepolia subdomain', () => {
        // @ts-ignore
        global.window.location = createMockLocation('sepolia.ens.domains')
        const result = getNetworkFromUrl()
        expect(result).toBe('sepolia')
      })

      it('should return holesky for holesky subdomain', () => {
        // @ts-ignore
        global.window.location = createMockLocation('holesky.ens.domains')
        const result = getNetworkFromUrl()
        expect(result).toBe('holesky')
      })

      it('should return mainnet for app.ens.domains', () => {
        // @ts-ignore
        global.window.location = createMockLocation('app.ens.domains')
        const result = getNetworkFromUrl()
        expect(result).toBe('mainnet')
      })

      it('should return mainnet for unknown hostname', () => {
        // @ts-ignore
        global.window.location = createMockLocation('unknown.example.com')
        const result = getNetworkFromUrl()
        expect(result).toBe('mainnet')
      })
    })
  })

  describe('getChainsFromUrl', () => {
    it('should return mainnet chains for mainnet network', () => {
      // @ts-ignore
      global.window.location = createMockLocation('app.ens.domains')
      const result = getChainsFromUrl()
      expect(result).toEqual([mainnetWithEns])
    })

    it('should return sepolia chains for sepolia network', () => {
      // @ts-ignore
      global.window.location = createMockLocation('sepolia.ens.domains')
      const result = getChainsFromUrl()
      expect(result).toEqual([sepoliaWithEns])
    })

    it('should return holesky chains for holesky network', () => {
      // @ts-ignore
      global.window.location = createMockLocation('holesky.ens.domains')
      const result = getChainsFromUrl()
      expect(result).toEqual([holeskyWithEns])
    })

    it('should return localhost chains for localhost network', async () => {
      process.env.NEXT_PUBLIC_PROVIDER = 'http://localhost:8545'
      // @ts-ignore
      global.window.location = createMockLocation('localhost')

      vi.resetModules()
      const { getChainsFromUrl: getChainsFromUrlFresh, localhostWithEns: localhostWithEnsFresh } =
        await import('./chains')
      const result = getChainsFromUrlFresh()
      expect(result).toEqual([localhostWithEnsFresh])
    })

    it('should return mainnet for undefined network', () => {
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
      })
      const result = getChainsFromUrl()
      expect(result).toMatchObject([mainnetWithEns])
    })
  })

  describe('chain configurations', () => {
    it('should have correct contract addresses for sepolia', () => {
      expect(sepoliaWithEns.contracts.ensEthRegistrarController?.address).toBe(
        '0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72',
      )
      expect(sepoliaWithEns.contracts.ensPublicResolver?.address).toBe(
        '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD',
      )
      expect(sepoliaWithEns.contracts.ensReverseRegistrar?.address).toBe(
        '0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6',
      )
    })

    it('should have correct contract addresses for holesky', () => {
      expect(holeskyWithEns.contracts.ensEthRegistrarController?.address).toBe(
        '0x179Be112b24Ad4cFC392eF8924DfA08C20Ad8583',
      )
      expect(holeskyWithEns.contracts.ensPublicResolver?.address).toBe(
        '0x9010A27463717360cAD99CEA8bD39b8705CCA238',
      )
      expect(holeskyWithEns.contracts.ensReverseRegistrar?.address).toBe(
        '0x132AC0B116a73add4225029D1951A9A707Ef673f ',
      )
    })

    it('should have correct chain ids', () => {
      expect(mainnetWithEns.id).toBe(mainnet.id)
      expect(sepoliaWithEns.id).toBe(sepolia.id)
      expect(holeskyWithEns.id).toBe(holesky.id)
      expect(localhostWithEns.id).toBe(localhost.id)
    })
  })
})
