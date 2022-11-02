import dotenv from 'dotenv'
import { ENS } from '..'
import setup from '../tests/setup'

dotenv.config()

let ensInstance: ENS

beforeAll(async () => {
  ;({ ensInstance } = await setup(true))
})

jest.setTimeout(20000)

describe('getProfile', () => {
  it('should return a profile from a ccip-read name', async () => {
    const result = await ensInstance.getProfile('1.offchainexample.eth', {
      fallback: {
        texts: ['email', 'description'],
        contentHash: true,
        coinTypes: ['0', '60'],
      },
    })
    expect(result).toBeTruthy()
    if (result) {
      expect(result.address).toBe('0x41563129cDbbD0c5D3e1c86cf9563926b243834d')
    }
  })
})
