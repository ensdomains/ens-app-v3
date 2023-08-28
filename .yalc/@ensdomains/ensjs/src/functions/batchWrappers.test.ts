import { ENS } from '..'
import setup from '../tests/setup'

let ensInstance: ENS

beforeAll(async () => {
  ;({ ensInstance } = await setup())
})

describe('batchWrappers', () => {
  it('should batch calls together', async () => {
    const batch = await ensInstance.resolverMulticallWrapper.raw([
      await ensInstance._getText.raw('with-profile.eth', 'description'),
      await ensInstance._getText.raw('with-profile.eth', 'url'),
      await ensInstance._getAddr.raw('with-profile.eth'),
    ])
    const universalResponse = await ensInstance.universalWrapper(
      'with-profile.eth',
      batch.data,
    )
    const [batchDecoded] = await ensInstance.resolverMulticallWrapper.decode(
      universalResponse?.data,
    )
    const decoded1 = await ensInstance._getText.decode(batchDecoded[0])
    const decoded2 = await ensInstance._getText.decode(batchDecoded[1])
    const decoded3 = await ensInstance._getAddr.decode(batchDecoded[2])
    expect(decoded1).toBe('Hello2')
    expect(decoded2).toBe('twitter.com')
    expect(decoded3).toBe('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
  })
})
