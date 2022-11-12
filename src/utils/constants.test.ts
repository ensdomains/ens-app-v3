import { RESOLVER_ADDRESSES } from './constants'

describe('RESOLVER_ADDRESSES', () => {
  it('should have the most recent resolver as the first address', () => {
    expect(RESOLVER_ADDRESSES['1'][0]).toEqual('0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41')
    expect(RESOLVER_ADDRESSES['1337'][0]).toEqual('0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB')
    expect(RESOLVER_ADDRESSES['5'][0]).toEqual('0xE264d5bb84bA3b8061ADC38D3D76e6674aB91852')
  })
})
