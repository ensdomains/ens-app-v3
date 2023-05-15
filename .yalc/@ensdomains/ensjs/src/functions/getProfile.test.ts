import dotenv from 'dotenv'
import { ethers } from 'ethers'
import { ENS } from '..'
import setup, { deploymentAddresses } from '../tests/setup'
import { ENSJSError } from '../utils/errors'

dotenv.config()

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]

beforeAll(async () => {
  ;({ ensInstance, revert, provider } = await setup())
  accounts = await provider.listAccounts()
})

beforeEach(async () => {
  await revert()
})

afterAll(async () => {
  await revert()
})

const checkRecords = (
  result: Record<string, any> | undefined,
  textLength = 3,
  coinTypeLength = 3,
) => {
  expect(result).toBeDefined()
  if (result) {
    expect(result.records?.texts).toHaveLength(textLength)
    expect(result.records?.coinTypes).toHaveLength(coinTypeLength)
    expect(result.resolverAddress).toBe(
      deploymentAddresses.LegacyPublicResolver,
    )
  }
}

jest.setTimeout(20000)

describe('getProfile', () => {
  describe('with an address', () => {
    it('should return a profile object with no other args', async () => {
      const result = await ensInstance.getProfile(
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      )
      expect(result).toBeDefined()
      if (result) {
        expect((result as any).name).toBe('with-profile.eth')
        expect((result as any).address).toBeUndefined()
        checkRecords(result)
      }
    })
    it('should return a profile object with specified records', async () => {
      const result = await ensInstance.getProfile(
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        { texts: ['description', 'url'], coinTypes: ['ETC_LEGACY', '0'] },
      )
      expect(result).toBeDefined()
      if (result) {
        expect((result as any).name).toBe('with-profile.eth')
        expect((result as any).address).toBeUndefined()
        checkRecords(result, 2, 3)
      }
    })
    it('should return a profile object with all of each specified record type', async () => {
      const result = await ensInstance.getProfile(
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        { texts: true, coinTypes: true },
      )
      checkRecords(result)
    })
    it('should return null for an address without a name', async () => {
      const result = await ensInstance.getProfile(
        '0x8e8db5ccef88cca9d624701db544989c996e3216',
      )
      expect(result).toBeUndefined()
    })

    describe('skipGraph', () => {
      it('should return undefined if skipGraph is true', async () => {
        const result = await ensInstance.getProfile(
          '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          { skipGraph: true },
        )
        expect(result).toBeUndefined()
      })

      it('should return undefined with specified records and skipGraph is true', async () => {
        const result = await ensInstance.getProfile(
          '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          {
            texts: ['description', 'url'],
            coinTypes: ['ETC_LEGACY', '0'],
            skipGraph: true,
          },
        )
        expect(result).toBeUndefined()
      })

      it('should return fallback records if skipGraph is true', async () => {
        const result = await ensInstance.getProfile(
          '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          {
            fallback: {
              texts: ['description', 'url'],
              coinTypes: ['ETC_LEGACY', '0'],
            },
            skipGraph: true,
          },
        )
        checkRecords(result, 2, 3)
      })
    })
  })
  describe('with a name', () => {
    it('should return a profile object with no other args', async () => {
      const result = await ensInstance.getProfile('with-profile.eth')
      expect((result as any).address).toBe(
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      )
      checkRecords(result)
    })
    it('should return a profile object with specified records', async () => {
      const result = await ensInstance.getProfile('with-profile.eth', {
        texts: ['description', 'url'],
        coinTypes: ['ETC_LEGACY', '0'],
      })
      expect((result as any).address).toBe(
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      )
      checkRecords(result, 2, 3)
    })
    it('should return a profile object with all of each specified record type', async () => {
      const result = await ensInstance.getProfile('with-profile.eth', {
        texts: true,
        coinTypes: true,
      })
      checkRecords(result)
    })
    it('should return a profile object for a specified resolver', async () => {
      const tx = await ensInstance.wrapName('test123.eth', {
        wrappedOwner: accounts[1],
        addressOrIndex: 1,
      })
      await tx.wait()
      const result = await ensInstance.getProfile('test123.eth', {
        resolverAddress: deploymentAddresses.LegacyPublicResolver,
      })
      expect(result).toBeDefined()
      expect(result?.address).toBe(accounts[1])
      expect(result?.resolverAddress).toBe(
        deploymentAddresses.LegacyPublicResolver,
      )
    })
    it('should return the decoded name for a name with encoded labels', async () => {
      const result = await ensInstance.getProfile(
        '[9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49].with-subnames.eth',
      )
      expect(result).toBeDefined()
      expect(result?.decryptedName).toBe('xyz.with-subnames.eth')
    })
    it('should return undefined for an unregistered name', async () => {
      const result = await ensInstance.getProfile('test123123123cool.eth')
      expect(result).toBeUndefined()
    })

    describe('skipGraph', () => {
      it('should return undefined if skipGraph is true', async () => {
        const result = await ensInstance.getProfile('with-profile.eth', {
          skipGraph: true,
        })
        expect(result).toBeUndefined()
      })
      it('should return undefined if skipGraph is true with specified records', async () => {
        const result = await ensInstance.getProfile('with-profile.eth', {
          texts: ['description', 'url'],
          coinTypes: ['ETC_LEGACY', '0'],
          skipGraph: true,
        })
        expect(result).toBeUndefined()
      })
      it('should return a profile object if skipGraph is true with fallback options', async () => {
        const result = await ensInstance.getProfile('with-profile.eth', {
          fallback: {
            texts: ['description', 'url'],
            coinTypes: ['ETC_LEGACY', '0'],
          },
          skipGraph: true,
        })
        checkRecords(result, 2, 3)
      })
    })
  })
  describe('with an old resolver', () => {
    it('should use fallback methods for a name with an older resolver (no multicall)', async () => {
      const result = await ensInstance.getProfile('with-legacy-resolver.eth')
      expect(result).toBeDefined()
      if (result) {
        expect(result.address).toBe(
          '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        )
        expect(result.resolverAddress).toBe(
          deploymentAddresses.NoMulticallResolver,
        )
      }
    })
  })
  describe('with an unmigrated name', () => {
    it('should return an object with isMigrated false and a message', async () => {
      const result = await ensInstance.getProfile('legacy.test')
      expect(result).toBeTruthy()
      if (result) {
        expect(result.isMigrated).toBe(false)
      }
    })
  })
  describe('with invalid resolver', () => {
    it('should fail gracefully for a name with invalid resolver', async () => {
      const tx = await ensInstance.setResolver('test123.eth', {
        contract: 'registry',
        resolver: '0xb794F5eA0ba39494cE839613fffBA74279579268',
        addressOrIndex: 1,
      })
      expect(tx).toBeTruthy()
      await tx.wait()
      const result = await ensInstance.getProfile('test123.eth')
      expect(result).toBeDefined()
      if (result) {
        expect(result.address).toBeUndefined()
        expect(Object.keys(result.records!).length).toBe(0)
        expect(result.resolverAddress).toBe(
          '0xb794F5eA0ba39494cE839613fffBA74279579268',
        )
        expect(result.isInvalidResolverAddress).toBe(true)
      }
    })

    it('should fail gracefully for a wrapped name with invalid resolver', async () => {
      const tx = await ensInstance.setResolver('wrapped.eth', {
        contract: 'nameWrapper',
        resolver: '0xb794F5eA0ba39494cE839613fffBA74279579268',
        addressOrIndex: 1,
      })
      expect(tx).toBeTruthy()
      await tx.wait()
      const result = await ensInstance.getProfile('wrapped.eth')
      expect(result).toBeDefined()
      if (result) {
        expect(result.address).toBeUndefined()
        expect(Object.keys(result.records!).length).toBe(0)
        expect(result.resolverAddress).toBe(
          '0xb794F5eA0ba39494cE839613fffBA74279579268',
        )
        expect(result.isInvalidResolverAddress).toBe(true)
      }
    })

    it('should fail gracefully for name with invalid resolver option', async () => {
      const result = await ensInstance.getProfile('test123.eth', {
        resolverAddress: '0xb794F5eA0ba39494cE839613fffBA74279579268',
      })
      expect(result).toBeDefined()
      if (result) {
        expect(result.address).toBeFalsy()
        expect(Object.keys(result.records!).length).toBe(0)
        expect(result.resolverAddress).toBe(
          '0xb794F5eA0ba39494cE839613fffBA74279579268',
        )
      }
    })

    it('should fail gracefully for wrapped name with invalid resolver option', async () => {
      const result = await ensInstance.getProfile('wrapped.eth', {
        resolverAddress: '0xb794F5eA0ba39494cE839613fffBA74279579268',
      })
      if (result) {
        expect(result.address).toBeFalsy()
        const recordsKeys = Object.keys(result.records!).filter(
          (key) => key !== 'contentHash',
        )
        expect(recordsKeys.length).toBe(0)
        const contentHash = result.records!.contentHash || {}
        expect(Object.keys(contentHash).length).toBe(0)
        expect(result.resolverAddress).toBe(
          '0xb794F5eA0ba39494cE839613fffBA74279579268',
        )
      }
    })
  })

  describe('errors', () => {
    beforeAll(() => {
      process.env.NEXT_PUBLIC_ENSJS_DEBUG = 'on'
      localStorage.setItem('ensjs-debug', 'ENSJSSubgraphError')
    })

    afterAll(() => {
      process.env.NEXT_PUBLIC_ENSJS_DEBUG = ''
      localStorage.removeItem('ensjs-debug')
    })

    it('should throw an ensjs error with no data', async () => {
      try {
        await ensInstance.getProfile('with-profile.eth')
        expect(true).toBeFalsy()
      } catch (e) {
        expect(e).toBeInstanceOf(ENSJSError)
        const error = e as ENSJSError<any>
        expect(error.name).toBe('ENSJSSubgraphError')
        expect(error.data).toBeUndefined()
      }
    })

    it('should throw error with data of fallback records', async () => {
      try {
        await ensInstance.getProfile(
          '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          {
            fallback: {
              texts: ['description', 'url'],
              coinTypes: ['ETC_LEGACY', '0'],
            },
          },
        )
        expect(true).toBeFalsy()
      } catch (e) {
        expect(e).toBeInstanceOf(ENSJSError)
        const error = e as ENSJSError<any>
        expect(error.name).toBe('ENSJSSubgraphError')
        checkRecords(error.data, 2, 3)
      }
    })

    it('should not throw an ensjs error if skipGraph is true', async () => {
      try {
        const result = await ensInstance.getProfile('with-profile.eth', {
          skipGraph: true,
          fallback: {
            texts: ['description', 'url'],
            coinTypes: ['ETC_LEGACY', '0'],
          },
        })
        checkRecords(result, 2, 3)
      } catch (e) {
        expect(true).toBeFalsy()
      }
    })
  })
})
