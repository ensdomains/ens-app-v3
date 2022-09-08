import { ENS } from '..'
import setup from '../tests/setup'
import { makeCommitment } from '../utils/registerHelpers'

let ENSInstance: ENS

beforeAll(async () => {
  ;({ ENSInstance } = await setup())
})

describe('makeCommitment', () => {
  it('should create a valid commitment', async () => {
    const resolver = await ENSInstance.contracts!.getPublicResolver()!
    const commitment = makeCommitment({
      name: 'test.eth',
      owner: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      duration: 1 * 365 * 24 * 60 * 60,
      resolver: resolver,
    })
    expect(commitment).toHaveProperty('secret')
    expect(commitment).toHaveProperty('commitment')
  })
})
