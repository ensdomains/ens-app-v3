import { ENS } from '..'
import setup from '../tests/setup'
import { ENSJSError } from '../utils/errors'
import { ReturnData } from './getHistory'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']

beforeAll(async () => {
  ;({ ensInstance, revert } = await setup())
})

afterAll(async () => {
  await revert()
})

describe('getHistory', () => {
  it('should return null for a non-existent name', async () => {
    const result = await ensInstance.getHistory('test123123cool.eth')
    expect(result).toBeUndefined()
  })
  it('should return the history of a name', async () => {
    const result = await ensInstance.getHistory('with-profile.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result).toHaveProperty('domain')
      expect(result).toHaveProperty('resolver')
      expect(result).toHaveProperty('registration')
    }
  })
  it('should return the history of a wrapped name', async () => {
    const result = await ensInstance.getHistory('wrapped.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result).toHaveProperty('domain')
      expect(result).toHaveProperty('resolver')
      expect(result).toHaveProperty('registration')
    }
  })
  it('should return the history of a subname', async () => {
    const result = await ensInstance.getHistory(
      'test.wrapped-with-subnames.eth',
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result).toHaveProperty('domain')
      expect(result).toHaveProperty('resolver')
      expect(result).not.toHaveProperty('registration')
    }
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

    it('should throw an error with no data', async () => {
      try {
        await ensInstance.getHistory('with-profile.eth')
        expect(true).toBeFalsy()
      } catch (e) {
        expect(e).toBeInstanceOf(ENSJSError)
        const error = e as ENSJSError<ReturnData>
        expect(error.data).toBeUndefined()
      }
    })
  })
})
