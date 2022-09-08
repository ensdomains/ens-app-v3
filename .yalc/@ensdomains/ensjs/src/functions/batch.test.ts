import { ENS } from '..'
import setup from '../tests/setup'

let ENSInstance: ENS

beforeAll(async () => {
  ;({ ENSInstance } = await setup())
})

describe('batch', () => {
  it('should batch calls together', async () => {
    const result = await ENSInstance.batch(
      ENSInstance.getText.batch('with-profile.eth', 'description'),
      ENSInstance.getAddr.batch('with-profile.eth'),
      ENSInstance.getName.batch('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
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
    const result = await ENSInstance.batch(
      ENSInstance.getText.batch('with-profile.eth', 'description'),
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result[0]).toBe('Hello2')
    }
  })
})
