import { ENS } from '..'
import setup from '../tests/setup'

let ensInstance: ENS

beforeAll(async () => {
  ;({ ensInstance } = await setup())
})

describe('getPrice', () => {
  it('should return a base and premium price for an address', async () => {
    const { base, premium } = (await ensInstance.getPrice(
      'test123',
      86400,
      false,
    ))!
    expect(base.toNumber()).toBe(86400)
    expect(premium.toNumber()).toBe(0)
  })

  it('should return a base and premium price for an address in legacy mode', async () => {
    const { base, premium } = (await ensInstance.getPrice(
      'test123',
      86400,
      true,
    ))!
    expect(base.toNumber()).toBe(86400)
    expect(premium.toNumber()).toBe(0)
  })

  it('should return a base and premium price for an array of names', async () => {
    const { base, premium } = (await ensInstance.getPrice(
      ['test123', 'to-be-renewed'],
      86400,
      false,
    ))!
    expect(base.toNumber()).toBe(86400 * 2)
    expect(premium.toNumber()).toBe(0)
  })
})
