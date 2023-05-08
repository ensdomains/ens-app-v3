import { ENS } from '..'
import setup from '../tests/setup'
import { ENSJSError } from '../utils/errors'

let ensInstance: ENS
let provider: any

beforeAll(async () => {
  ;({ ensInstance, provider } = await setup())
})

describe('batch', () => {
  it('should batch calls together', async () => {
    const result = await ensInstance.batch(
      ensInstance.getText.batch('with-profile.eth', 'description'),
      ensInstance.getAddr.batch('with-profile.eth'),
      ensInstance.getName.batch('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result[0]).toBe('Hello2')
      expect(result[1]).toBe('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
      expect(result[2]).toMatchObject({
        name: 'with-profile.eth',
        match: true,
      })
    }
  })
  it('should batch a single call', async () => {
    const result = await ensInstance.batch(
      ensInstance.getText.batch('with-profile.eth', 'description'),
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result[0]).toBe('Hello2')
    }
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
      localStorage.removeItem('ensjs-debug')
    })

    it('should throw a single error if there is an indexing error', async () => {
      localStorage.setItem('ensjs-debug', 'ENSJSSubgraphIndexingError')
      try {
        await ensInstance.batch(
          ensInstance.getText.batch('with-profile.eth', 'description'),
          ensInstance.getOwner.batch('expired.eth', { skipGraph: false }),
          ensInstance.getName.batch(
            '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          ),
        )
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(ENSJSError)
        const error = e as ENSJSError<any[]>
        expect(error.name).toBe('ENSJSSubgraphIndexingError')
        const result = error.data as any[]
        expect(result[0]).toBe('Hello2')
        expect(result[1]).toEqual({
          expired: true,
          owner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          ownershipLevel: 'registrar',
          registrant: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        })
        expect(result[2]).toMatchObject({
          name: 'with-profile.eth',
          match: true,
        })
      }
    })

    it('should throw a single error if there is an unknown error', async () => {
      localStorage.setItem('ensjs-debug', 'ENSJSUnknownError')
      try {
        await ensInstance.batch(
          ensInstance.getText.batch('with-profile.eth', 'description'),
          ensInstance.getOwner.batch('expired.eth', { skipGraph: false }),
          ensInstance.getName.batch(
            '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          ),
        )
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(ENSJSError)
        const error = e as ENSJSError<any[]>
        expect(error.name).toBe('ENSJSUnknownError')
        const result = error.data as any[]
        expect(result[0]).toBe('Hello2')
        expect(result[1]).toEqual(undefined)
        expect(result[2]).toMatchObject({
          name: 'with-profile.eth',
          match: true,
        })
      }
    })
  })
})
