import { mockFunction, render, screen } from '@app/test-utils'

import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'

import Fuses from './Fuses'

jest.mock('next/router')

const mockUseRouter = mockFunction(useRouter)

const mockFusesResponse = {
  fuseObj: {
    CANNOT_UNWRAP: false,
    CANNOT_BURN_FUSES: false,
    CANNOT_TRANSFER: false,
    CANNOT_SET_RESOLVER: false,
    CANNOT_SET_TTL: false,
    CANNOT_CREATE_SUBDOMAIN: false,
    PARENT_CANNOT_CONTROL: true,
    CAN_DO_EVERYTHING: false,
    CAN_EXTEND_EXPIRY: true,
  },
  rawFuses: BigNumber.from('0x40'),
}

const defaultProps = {
  name: 'nick.eth',
  fuseObj: mockFusesResponse.fuseObj,
  canEdit: false,
  isCachedData: false,
}

describe('Fuses', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    render(<Fuses {...defaultProps} />)
  })

  it('should show warning if PCC has NOT been burned', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    const props = {
      ...defaultProps,
      fuseObj: { ...mockFusesResponse.fuseObj, PARENT_CANNOT_CONTROL: false },
    }
    render(<Fuses {...props} />)
    expect(screen.getByText('tabs.more.fuses.permissions.warning')).toBeVisible()
  })
})
