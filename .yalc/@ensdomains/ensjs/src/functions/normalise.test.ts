import { namehash } from '../utils/normalise'

describe('normalise', () => {
  it('should namehash an empty string', () => {
    const hash = namehash('')
    expect(hash).toEqual(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    )
  })
  it('should namehash a TLD', () => {
    const hash = namehash('eth')
    expect(hash).toEqual(
      '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
    )
  })
  it('should namehash a 2LD', () => {
    const hash = namehash('foo.eth')
    expect(hash).toEqual(
      '0xde9b09fd7c5f901e23a3f19fecc54828e9c848539801e86591bd9801b019f84f',
    )
  })
})
