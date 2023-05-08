import { JsonRpcProvider } from '@ethersproject/providers'
import { ENS } from '..'
import setup from '../tests/setup'
import { ENSJSError } from '../utils/errors'
import { Owner } from './getOwner'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let provider: JsonRpcProvider
let accounts: string[]

beforeAll(async () => {
  ;({ ensInstance, revert, provider } = await setup())
  accounts = await provider.listAccounts()
})

afterAll(async () => {
  await revert()
})

describe('getOwner', () => {
  it('should return undefined for an nonexistent .eth name', async () => {
    const result = await ensInstance.getOwner('nonexistent.eth', {
      skipGraph: false,
    })
    expect(result).toBeUndefined()
  })

  it('should return correct ownership level and values for a wrapped .eth name', async () => {
    const result = await ensInstance.getOwner('wrapped.eth')
    expect(result).toEqual({
      ownershipLevel: 'nameWrapper',
      owner: accounts[1],
      expired: false,
    })
  })
  it('should return correct ownership level and values for an expired wrapped .eth name', async () => {
    const result = await ensInstance.getOwner('expired-wrapped.eth', {
      skipGraph: false,
    })
    expect(result).toEqual({
      ownershipLevel: 'nameWrapper',
      owner: '0x0000000000000000000000000000000000000000',
      expired: true,
    })
  })
  it('should return correct ownership level and values for an unwrapped .eth name', async () => {
    const result = await ensInstance.getOwner('test123.eth')
    expect(result).toEqual({
      ownershipLevel: 'registrar',
      owner: accounts[1],
      registrant: accounts[1],
      expired: false,
    })
  })
  it('should return correct ownership level and values for an expired unwrapped .eth name', async () => {
    const result = await ensInstance.getOwner('expired.eth', {
      skipGraph: false,
    })
    expect(result).toEqual({
      ownershipLevel: 'registrar',
      owner: accounts[1],
      registrant: accounts[1].toLowerCase(),
      expired: true,
    })
  })
  describe('subname', () => {
    it('should return correct ownership level and values for a unwrapped name', async () => {
      const result = await ensInstance.getOwner('test.with-subnames.eth')
      expect(result).toEqual({
        ownershipLevel: 'registry',
        owner: accounts[2],
      })
    })
    it('should return correct ownership level and values for a wrapped name', async () => {
      const result = await ensInstance.getOwner(
        'test.wrapped-with-subnames.eth',
      )
      expect(result).toEqual({
        ownershipLevel: 'nameWrapper',
        owner: accounts[2],
      })
    })
    it('should return correct ownership level and values for an expired wrapped name', async () => {
      const result = await ensInstance.getOwner('test.expired-wrapped.eth')
      expect(result).toEqual({
        ownershipLevel: 'nameWrapper',
        owner: accounts[2],
      })
    })
  })

  describe('skipGraph', () => {
    it('should return correct ownership level and values for an expired wrapped .eth name', async () => {
      const result = await ensInstance.getOwner('expired-wrapped.eth', {
        skipGraph: true,
      })

      expect(result).toEqual({
        ownershipLevel: 'nameWrapper',
        owner: '0x0000000000000000000000000000000000000000',
        expired: true,
      })
    })

    it('should return registrant undefined if skipGraph is true for an unwrapped .eth name', async () => {
      const result = await ensInstance.getOwner('expired.eth', {
        skipGraph: true,
      })
      expect(result).toEqual({
        ownershipLevel: 'registrar',
        owner: accounts[1],
        expired: true,
      })
    })
  })
  describe('errors', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development'
      jest
        .spyOn(provider, 'getBlock')
        .mockImplementation(() =>
          Promise.resolve({ timestamp: 1671169189 } as any),
        )
    })
    afterAll(() => {
      process.env.NODE_ENV = 'test'
    })

    it('should return correct ownership level and values for an expired wrapped .eth name', async () => {
      try {
        await ensInstance.getOwner('expired-wrapped.eth')
      } catch (e: unknown) {
        const error = e as ENSJSError<Owner>
        expect(error).toBeInstanceOf(ENSJSError)
        expect(error.name).toBe('ENSJSSubgraphIndexingError')
        expect(error.data).toEqual({
          registrant: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
          owner: '0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E',
          ownershipLevel: 'registrar',
          expired: true,
        })
        expect(error.timestamp).toBe(1682524901)
      }
    })

    it('should return correct ownership level and values for an expired unwrapped .eth name', async () => {
      try {
        await ensInstance.getOwner('expired.eth')
      } catch (e) {
        const error = e as ENSJSError<Owner>
        expect(error).toBeInstanceOf(ENSJSError)
        expect(error.name).toBe('ENSJSSubgraphIndexingError')
        expect(error.data).toEqual({
          registrant: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
          owner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          ownershipLevel: 'registrar',
          expired: true,
        })
        expect(error.timestamp).toBe(1682524901)
      }
    })

    describe('ENSJSUnknownError', () => {
      beforeAll(() => {
        localStorage.setItem('ensjs-debug', 'ENSJSUnknownError')
      })

      afterAll(() => {
        localStorage.removeItem('ensjs-debug')
      })

      it('should return registrant is undefined if skipGraph is true for an expired wrapped .eth name', async () => {
        const result = await ensInstance.getOwner('expired-wrapped.eth', {
          skipGraph: true,
        })
        expect(result).toEqual({
          ownershipLevel: 'nameWrapper',
          owner: '0x0000000000000000000000000000000000000000',
          expired: true,
        })
      })

      it('should return registrant is undefined if skipGraph is true for an expired unwrapped .eth name', async () => {
        const result = await ensInstance.getOwner('expired.eth', {
          skipGraph: true,
        })
        expect(result).toEqual({
          ownershipLevel: 'registrar',
          owner: accounts[1],
          expired: true,
        })
      })

      it('should return undefined for a name that does not exist', async () => {
        const result = await ensInstance.getOwner('notexistent.eth', {
          skipGraph: true,
        })
        expect(result).toBeUndefined()
      })
    })
  })
})
