import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { ENS } from '..'
import setup from '../tests/setup'

dotenv.config()

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]

beforeAll(async () => {
  ;({ ensInstance, revert, provider } = await setup())
  accounts = await provider.listAccounts()
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
      '0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8',
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
        { texts: ['description', 'url'], coinTypes: ['ETC', '0'] },
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
        coinTypes: ['ETC', '0'],
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
        resolverAddress: '0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8',
      })
      expect(result).toBeDefined()
      expect(result?.address).toBe(accounts[1])
      expect(result?.resolverAddress).toBe(
        '0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8',
      )
    })
    it('should return undefined for an unregistered name', async () => {
      const result = await ensInstance.getProfile('test123123123cool.eth')
      expect(result).toBeUndefined()
    })
  })
  describe('with an old resolver', () => {
    it('should use fallback methods for a name with an older resolver (no multicall)', async () => {
      const result = await ensInstance.getProfile('with-legacy-resolver.eth')
      const deploymentAddresses = JSON.parse(process.env.DEPLOYMENT_ADDRESSES!)
      expect(result).toBeDefined()
      if (result) {
        expect(result.address).toBe(
          '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        )
        expect(result.resolverAddress).toBe(
          deploymentAddresses.NoMulticallResolver.toLowerCase(),
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
})
