import { OwnerArray } from '@app/types'

import { ownershipInfoCalc } from './ProfileDetails'

describe('onwershipInfoCalc', () => {
  it('should return no owner if PCC is expired', () => {
    const result = ownershipInfoCalc(true, [], new Date(), new Date())
    expect(result).toEqual([
      {
        key: 'owner',
        type: 'text',
        value: '',
      },
    ])
  })
  it('if unwrapped and expired, should return manager and expiry', () => {
    const expiryDate = new Date(1)
    const gracePeriodEndDate = new Date(2)
    const owners = [{ transferType: 'manager', address: '0x123' }] as OwnerArray

    const result = ownershipInfoCalc(false, owners, gracePeriodEndDate, expiryDate)
    expect(result).toEqual([
      { key: 'owner', type: 'text', value: '' },
      { key: 'manager', type: 'text', value: '0x123' },
      {
        key: 'expiry',
        type: 'text',
        value: '\nJanuary 1, 1970',
        timestamp: 1,
      },
    ])
  })
  it('If not expired, show owners and expiry', () => {
    const expiryDate = new Date(3255803954000)
    const gracePeriodEndDate = new Date(3255803954000 + 1000 * 60 * 60 * 24 * 30)
    const owners = [
      { transferType: 'manager', address: '0x123', label: 'manager' },
      { transferType: 'owner', address: '0x123', label: 'owner' },
    ] as OwnerArray

    // Date string is locale based. Ignore this test if it fails as March 4, 2073
    const result = ownershipInfoCalc(false, owners, gracePeriodEndDate, expiryDate)
    expect(result).toEqual([
      { key: 'manager', value: '0x123' },
      { key: 'owner', value: '0x123' },
      {
        key: 'expiry',
        type: 'text',
        value: '\nMarch 3, 2073',
        timestamp: 3255803954000,
      },
    ])
  })
})
