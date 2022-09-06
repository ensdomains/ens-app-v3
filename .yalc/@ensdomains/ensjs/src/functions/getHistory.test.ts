import { ENS } from '..'
import setup from '../tests/setup'

let ENSInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']

beforeAll(async () => {
  ;({ ENSInstance, revert } = await setup())
})

afterAll(async () => {
  await revert()
})

describe('getHistory', () => {
  it('should return null for a non-existent name', async () => {
    const result = await ENSInstance.getHistory('test123123cool.eth')
    expect(result).toBeUndefined()
  })
  it('should return the history of a name', async () => {
    const result = await ENSInstance.getHistory('with-profile.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result).toHaveProperty('domain')
      expect(result).toHaveProperty('resolver')
      expect(result).toHaveProperty('registration')
    }
  })
})
