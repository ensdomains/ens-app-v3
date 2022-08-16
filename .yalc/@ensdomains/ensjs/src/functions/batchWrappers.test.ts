import { ENS } from '..'
import setup from '../tests/setup'

let ENSInstance: ENS

beforeAll(async () => {
  ;({ ENSInstance } = await setup())
})

describe('batchWrappers', () => {
  it('should batch calls together', async () => {
    const batch = await ENSInstance.resolverMulticallWrapper.raw([
      await ENSInstance._getText.raw('with-profile.eth', 'description'),
      await ENSInstance._getText.raw('with-profile.eth', 'url'),
      await ENSInstance._getAddr.raw('with-profile.eth'),
    ])
    const universalResponse = await ENSInstance.universalWrapper(
      'with-profile.eth',
      batch.data,
    )
    const [batchDecoded] = await ENSInstance.resolverMulticallWrapper.decode(
      universalResponse?.data,
    )
    const decoded1 = await ENSInstance._getText.decode(batchDecoded[0])
    const decoded2 = await ENSInstance._getText.decode(batchDecoded[1])
    const decoded3 = await ENSInstance._getAddr.decode(batchDecoded[2])
    expect(decoded1).toBe('Hello2')
    expect(decoded2).toBe('twitter.com')
    expect(decoded3).toBe('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
  })
})
