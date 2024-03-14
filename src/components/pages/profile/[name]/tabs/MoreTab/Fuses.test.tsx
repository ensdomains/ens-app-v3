import { render, screen } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import Fuses from './Fuses'

const mockFusesResponse = {
  fuseObj: {
    CANNOT_UNWRAP: false,
    CANNOT_BURN_FUSES: false,
    CANNOT_TRANSFER: false,
    CANNOT_SET_RESOLVER: false,
    CANNOT_SET_TTL: false,
    CANNOT_APPROVE: false,
    CANNOT_CREATE_SUBDOMAIN: false,
    PARENT_CANNOT_CONTROL: true,
    CAN_DO_EVERYTHING: false,
    CAN_EXTEND_EXPIRY: true,
  },
  rawFuses: 0x40n,
}

const defaultProps = {
  name: 'nick.eth',
  fuseObj: mockFusesResponse.fuseObj,
  canEdit: false,
  isCachedData: false,
}

describe('Fuses', () => {
  it('should render', () => {
    render(<Fuses {...defaultProps} />)
  })

  it('should show warning if PCC has NOT been burned', () => {
    const props = {
      ...defaultProps,
      fuseObj: { ...mockFusesResponse.fuseObj, PARENT_CANNOT_CONTROL: false },
    }
    render(<Fuses {...props} />)
    expect(screen.getByText('tabs.more.fuses.permissions.warning')).toBeVisible()
  })
})
