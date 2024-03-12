import { describe, expect, it } from 'vitest'

import { validateContentHash } from './validateContentHash'

const ipfsHttp = 'https://ipfs.euc.li/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu'
const ipnsHttp =
  'https://ipfs.euc.li/ipns/k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8'
const ipfs = 'ipfs://Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu'
const ipns = 'ipns://k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8'
const swarm = 'bzz://d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162'
const onion = 'onion://8zd335ae47dp89pd'
const onion3 = 'onion3://jamie3vkiwibfiwucd6vxijskbhpjdyajmzeor4mc4i7yopvpo4p7cyd'
const skylink = 'sia://CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg'
const arweave = 'arweave://ys32Pt8uC7TrVxHdOLByOspfPEq2LO63wREHQIM9SJQ'
const ar = 'ar://ys32Pt8uC7TrVxHdOLByOspfPEq2LO63wREHQIM9SJQ'

const invalidate = (url: string) => `${url}invalid`

describe('validateContentHash', () => {
  it('should return true for valid ipfs url', () => {
    expect(validateContentHash('ipfs')(ipfs)).toBe(true)
  })

  it('should fail for invalid ipfs url', () => {
    expect(typeof validateContentHash('ipfs')(invalidate(ipfs))).toBe('string')
  })

  it('should return true for valid ipfs http url', () => {
    expect(validateContentHash('ipfs')(ipfsHttp)).toBe(true)
  })

  it('should fail for invalid ipfs http url', () => {
    expect(typeof validateContentHash('ipfs')(invalidate(ipfsHttp))).toBe('string')
  })

  it('should return true for valid ipns url', () => {
    expect(validateContentHash('ipfs')(ipns)).toBe(true)
  })

  it('should fail for invalid ipns url', () => {
    expect(typeof validateContentHash('ipfs')(invalidate(ipns))).toBe('string')
  })

  it('should return true for valid ipns http url', () => {
    expect(validateContentHash('ipfs')(ipnsHttp)).toBe(true)
  })

  it('should fail for invalid ipns url', () => {
    expect(typeof validateContentHash('ipfs')(invalidate(ipnsHttp))).toBe('string')
  })

  it('should return true for a valid swarm url', () => {
    expect(validateContentHash('swarm')(swarm)).toBe(true)
  })

  it('should return true for valid onion url', () => {
    expect(validateContentHash('onion')(onion)).toBe(true)
  })

  it('should fail for invalid onion url', () => {
    expect(typeof validateContentHash('onion')(invalidate(onion))).toBe('string')
  })

  it('should return true for valid onion3 url', () => {
    expect(validateContentHash('onion')(onion3)).toBe(true)
  })

  it('should fail for invalid onion3 url', () => {
    expect(typeof validateContentHash('onion')(invalidate(onion3))).toBe('string')
  })

  it('should return true for valid sia url', () => {
    expect(validateContentHash('skynet')(skylink)).toBe(true)
  })

  it('should fail for invalid sia url', () => {
    expect(typeof validateContentHash('skynet')(invalidate(skylink))).toBe('string')
  })

  it('should return true for valid arweave url', () => {
    expect(validateContentHash('arweave')(arweave)).toBe(true)
  })

  it('should return true for valid ar url', () => {
    expect(validateContentHash('arweave')(ar)).toBe(true)
  })

  it('should fail for invalid arweave url', () => {
    expect(typeof validateContentHash('arweave')(invalidate(arweave))).toBe('string')
  })

  it('should faile for invalid ar url', () => {
    expect(typeof validateContentHash('arweave')(invalidate(ar))).toBe('string')
  })

  it('should fail if the content hash is undefined', () => {
    expect(typeof validateContentHash(undefined as any)(ipfs)).toBe('string')
  })

  it('should fail if the content hash is not recognized', () => {
    expect(typeof validateContentHash('pins' as any)(ipfs)).toBe('string')
  })

  it('should return true for all valid urls if content hash option is set to "all"', () => {
    expect(validateContentHash('all')(ipfs)).toBe(true)
    expect(validateContentHash('all')(ipfsHttp)).toBe(true)
    expect(validateContentHash('all')(ipns)).toBe(true)
    expect(validateContentHash('all')(ipnsHttp)).toBe(true)
    expect(validateContentHash('all')(swarm)).toBe(true)
    expect(validateContentHash('all')(onion)).toBe(true)
    expect(validateContentHash('all')(onion3)).toBe(true)
    expect(validateContentHash('all')(skylink)).toBe(true)
    expect(validateContentHash('all')(arweave)).toBe(true)
    expect(validateContentHash('all')(ar)).toBe(true)
  })
})
