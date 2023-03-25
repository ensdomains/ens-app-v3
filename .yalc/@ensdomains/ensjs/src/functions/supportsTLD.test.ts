import { ENS } from '..'
import setup from '../tests/setup'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']

beforeAll(async () => {
  ;({ ensInstance, revert } = await setup())
})

afterAll(async () => {
  await revert()
})

describe('supportsTLD', () => {
  it('should return true for .eth tld', async () => {
    const result = await ensInstance.supportsTLD('eth')
    expect(result).toBeTruthy()
  })

  it('should return true for .xyz tld', async () => {
    const result = await ensInstance.supportsTLD('xyz')
    expect(result).toBeTruthy()
  })

  it('should return false for .com tld', async () => {
    const result = await ensInstance.supportsTLD('com')
    expect(result).toBeFalsy()
  })

  it('should return true for .eth name', async () => {
    const result = await ensInstance.supportsTLD('test123.eth')
    expect(result).toBeTruthy()
  })

  it('should return true for .xyz name', async () => {
    const result = await ensInstance.supportsTLD('test123.xyz')
    expect(result).toBeTruthy()
  })

  it('should return false for .com name', async () => {
    const result = await ensInstance.supportsTLD('test123.com')
    expect(result).toBeFalsy()
  })
})
