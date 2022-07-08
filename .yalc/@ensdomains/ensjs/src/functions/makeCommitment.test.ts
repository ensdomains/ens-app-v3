import { ENS } from '..'
import { makeCommitment } from '../utils/registerHelpers'
import setup from '../tests/setup'

let ENSInstance: ENS

beforeAll(async () => {
  ;({ ENSInstance } = await setup())
})

describe('makeCommitment', () => {
  it('should create a valid commitment', async () => {
    const resolver = await ENSInstance.contracts!.getPublicResolver()!
    const commitment = makeCommitment({
      name: 'test.eth',
      owner: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
      duration: 1 * 365 * 24 * 60 * 60,
      resolver: resolver,
    })
    expect(commitment).toHaveProperty('secret')
    expect(commitment).toHaveProperty('commitment')
  })
})
