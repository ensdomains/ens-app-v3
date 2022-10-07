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
  it('should return ccip', async () => {
    const result = await ensInstance.getProfile('stani.lens.xyz', {
      fallback: {
        texts: ['email', 'description'],
        contentHash: true,
        coinTypes: ['0', '60'],
      },
    })
    console.log(result)
  })
})
