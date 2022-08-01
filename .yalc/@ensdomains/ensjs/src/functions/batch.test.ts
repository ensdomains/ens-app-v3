import { ENS } from '..'
import setup from '../tests/setup'

let ENSInstance: ENS

beforeAll(async () => {
  ;({ ENSInstance } = await setup())
})

describe('batch', () => {
  it('should batch calls together', async () => {
    const result = await ENSInstance.batch(
      ENSInstance.getText.batch('jefflau.eth', 'description'),
      ENSInstance.getAddr.batch('jefflau.eth'),
      ENSInstance.getName.batch('0x866B3c4994e1416B7C738B9818b31dC246b95eEE'),
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result[0]).toBe('Hello2')
      expect(result[1]).toBe('0x866B3c4994e1416B7C738B9818b31dC246b95eEE')
      expect(result[2]).toMatchObject({
        name: 'jefflau.eth',
        match: true,
      })
    }
  })
  it('should batch a single call', async () => {
    const result = await ENSInstance.batch(
      ENSInstance.getText.batch('jefflau.eth', 'description'),
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result[0]).toBe('Hello2')
    }
  })
})
