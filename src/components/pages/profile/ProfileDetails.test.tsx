import '@app/test-utils'

import { OwnerArray } from '@app/types'

import { ownershipInfoCalc } from './ProfileDetails'

import { ProfileDetails } from './ProfileDetails'
import { render, screen } from '@app/test-utils'

jest.mock('@app/utils/BreakpointProvider', () => ({
  useBreakpoint: () => ({
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: false,
  })
}))

describe('onwershipInfoCalc', () => {
  it('should return no owner if PCC is expired', () => {
    const result = ownershipInfoCalc('', true, [], new Date(), new Date())
    expect(result).toEqual([
      {
        key: 'name.owner',
        type: 'text',
        value: '',
      },
      {
        key: 'name.parent',
        type: 'text',
        value: '',
      },
    ])
  })
  it('if unwrapped and expired, should return manager and expiry', () => {
    const expiryDate = new Date(1)
    const gracePeriodEndDate = new Date(2)
    const owners = [
      { transferType: 'manager', address: '0x123', label: 'name.manager' },
    ] as OwnerArray

    const result = ownershipInfoCalc('eth', false, owners, gracePeriodEndDate, expiryDate)

    expect(result).toEqual([
      { key: 'name.owner', type: 'text', value: '' },
      { key: 'name.manager', type: 'text', value: '0x123' },
      {
        key: 'name.expiry',
        type: 'text',
        value: 'January 1, 1970',
        timestamp: 1,
      },
      {
        key: 'name.parent',
        type: 'text',
        value: '[root]',
      },
    ])
  })
  it('If not expired, show owners and expiry', () => {
    const expiryDate = new Date(3255803954000)
    const gracePeriodEndDate = new Date(3255803954000 + 1000 * 60 * 60 * 24 * 30)
    const owners = [
      { transferType: 'manager', address: '0x123', label: 'name.manager' },
      { transferType: 'owner', address: '0x123', label: 'name.owner' },
    ] as OwnerArray

    // Date string is locale based. Ignore this test if it fails as March 4, 2073
    const result = ownershipInfoCalc('test.eth', false, owners, gracePeriodEndDate, expiryDate)

    const expectedExpiryLabel = expiryDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    expect(result).toEqual([
      { key: 'name.manager', value: '0x123' },
      { key: 'name.owner', value: '0x123' },
      {
        key: 'name.expiry',
        type: 'text',
        value: expectedExpiryLabel,
        timestamp: 3255803954000,
      },
      {
        key: 'name.parent',
        type: 'text',
        value: 'eth',
      },
    ])
  })

  it('should return parent as [root] if TLD', () => {
    const result = ownershipInfoCalc('eth', true, [], new Date(), new Date())
    expect(result).toEqual([
      {
        key: 'name.owner',
        type: 'text',
        value: '',
      },
      {
        key: 'name.parent',
        type: 'text',
        value: '[root]',
      },
    ])
  })
})

describe('ProfileDetails', () => {
  it('should show content hash if there is valid contenthash', () => {
    render(<ProfileDetails name="test.eth" expiryDate={undefined} textRecords={[]} addresses={[]} pccExpired={false} owners={[]} actions={[]} contentHash="ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" />)
    expect(screen.getByTestId('other-profile-button-contenthash')).toBeVisible()
    expect(screen.getByText('ipfs://QmXoypiz...')).toBeVisible()
  })

  it('should not show content hash if contenthash is empty', () => {
    render(<ProfileDetails name="test.eth" expiryDate={undefined} textRecords={[]} addresses={[]} pccExpired={false} owners={[]} actions={[]} contentHash={{}} />)
    expect(screen.queryByTestId('other-profile-button-contenthash')).toBeNull()
  })
})