import { ENS } from '..'
import setup from '../tests/setup'

let ENSInstance: ENS

beforeAll(async () => {
  ;({ ENSInstance } = await setup())
})

describe('getResolver', () => {
  it('should find the resolver for a name with a resolver', async () => {
    const result = await ENSInstance.getResolver('jefflau.eth')
    expect(result).toBe('0x42D63ae25990889E35F215bC95884039Ba354115')
  })
  it('should return .eth resolver for an unregistered name', async () => {
    const result = await ENSInstance.getResolver('test123123cool.eth')
    expect(result).toBe('0x3E8Dc215A6E404A7Ba811DE5Da3ff2A809AE94E2')
  })
})
