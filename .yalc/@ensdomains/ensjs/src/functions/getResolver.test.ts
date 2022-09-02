import { ENS } from '..'
import setup from '../tests/setup'

let ENSInstance: ENS

beforeAll(async () => {
  ;({ ENSInstance } = await setup())
})

describe('getResolver', () => {
  it('should find the resolver for a name with a resolver', async () => {
    const result = await ENSInstance.getResolver('with-profile.eth')
    expect(result).toBe('0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8')
  })
})
