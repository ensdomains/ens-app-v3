import contentHash from '@ensdomains/content-hash'

import { validateContentHash } from './validateContentHash'

const ipfsHttp = 'https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu'
const ipnsHttp =
  'https://ipfs.io/ipns/k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8'
const swarm = 'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'
const onion = 'onion://8zd335ae47dp89pd'
const onion3 = 'onion3://jamie3vkiwibfiwucd6vxijskbhpjdyajmzeor4mc4i7yopvpo4p7cyd'

describe('validateContentHash', () => {
  it('should return true for http ipfs', () => {
    const result = validateContentHash('ipfs')(ipfsHttp)
    expect(result).toBe(true)
  })

  it('should return true for http ipfs', () => {
    const result = validateContentHash('ipfs')(ipnsHttp)
    expect(result).toBe(true)
  })

  it('should return true for a valid swarm url', () => {
    const result = validateContentHash('swarm')(swarm)
    expect(result).toBe(true)
  })

  it('should return true for onion', () => {
    const result = validateContentHash('onion')(onion)
    expect(result).toBe(true)
  })

  it('should return true for http ipfs', () => {
    const result = validateContentHash('onion')(onion3)
    expect(result).toBe(true)
  })

  it('should', () => {
    const result = contentHash.fromSwarm(
      'd1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
    )
    console.log(result)
  })

  it('should', () => {
    const result = contentHash.encode(
      'swarm-ns',
      'd1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
    )
    console.log(result)
  })
})
