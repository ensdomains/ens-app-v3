import { getContractAddress } from '@ensdomains/ensjs/contracts/getContractAddress'

import { RESOLVER_ADDRESSES } from './constants'

describe('RESOLVER_ADDRESSES', () => {
  it('should have the most recent resolver as the first address', () => {
    expect(RESOLVER_ADDRESSES['1'][0]).toEqual(getContractAddress('1')('PublicResolver'))
    expect(RESOLVER_ADDRESSES['1337'][0]).toEqual('0x0E801D84Fa97b50751Dbf25036d067dCf18858bF')
    expect(RESOLVER_ADDRESSES['5'][0]).toEqual(getContractAddress('5')('PublicResolver'))
  })
})
