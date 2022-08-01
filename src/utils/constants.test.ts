import { RESOLVER_ADDRESSES } from './constants'

describe('RESOLVER_ADDRESSES', () => {
  it('should have the most recent resolver as the first address', () => {
    expect(RESOLVER_ADDRESSES[0]).toEqual(
      '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    )
  })
})
