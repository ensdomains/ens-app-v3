import dotenv from 'dotenv'
import { ENS } from '..'
import setup from '../tests/setup'

dotenv.config()

let ensInstance: ENS

beforeAll(async () => {
  ;({ ensInstance } = await setup(true))
})

jest.setTimeout(20000)

describe('CCIP', () => {
  describe('getProfile', () => {
    it('should return a profile from a ccip-read name', async () => {
      const result = await ensInstance.getProfile('1.offchainexample.eth', {
        fallback: {
          texts: ['email', 'description'],
          contentHash: true,
          coinTypes: ['LTC', '60'],
        },
      })
      expect(result).toBeTruthy()
      if (result) {
        expect(result.address).toBe(
          '0x41563129cDbbD0c5D3e1c86cf9563926b243834d',
        )
      }
    })
    it('should return a profile from arb-resolver.eth', async () => {
      const result = await ensInstance.getProfile('arb-resolver.eth', {
        fallback: {
          texts: ['email', 'description'],
          contentHash: true,
          coinTypes: ['LTC', '60'],
        },
      })
      expect(result).toBeTruthy()
      if (result) {
        expect(result.address).toBe(
          '0xA5313060f9FA6B607AC8Ca8728a851166c9f6127',
        )
      }
    })
  })
  describe('batch', () => {
    it('allows batch ccip', async () => {
      const result = await ensInstance.batch(
        ensInstance.getAddr.batch('1.offchainexample.eth'),
        ensInstance.getAddr.batch('1.offchainexample.eth', 'LTC'),
        ensInstance.getText.batch('1.offchainexample.eth', 'email'),
      )
      expect(result).toBeTruthy()
      if (result) {
        expect(result[0]).toBe('0x41563129cDbbD0c5D3e1c86cf9563926b243834d')
        expect(result[1]).toStrictEqual({
          coin: 'LTC',
          addr: 'MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441',
        })
        expect(result[2]).toBe('nick@ens.domains')
      }
    })
    it('allows nested batch ccip', async () => {
      const result = await ensInstance.batch(
        ensInstance.batch.batch(
          ensInstance.getAddr.batch('1.offchainexample.eth'),
        ),
      )
      expect(result).toBeTruthy()
      if (result) {
        expect(result[0]![0]).toBe('0x41563129cDbbD0c5D3e1c86cf9563926b243834d')
      }
    })
  })
})
