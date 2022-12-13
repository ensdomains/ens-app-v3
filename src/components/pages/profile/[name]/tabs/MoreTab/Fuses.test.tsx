import { mockFunction, render, screen } from '@app/test-utils'

import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'

import { useGetWrapperData } from '@app/hooks/useGetWrapperData'

import Fuses from './Fuses'

jest.mock('next/router')
jest.mock('@app/hooks/useGetWrapperData')

const mockUseRouter = mockFunction(useRouter)
const mockUseGetWrapperData = mockFunction(useGetWrapperData)

const mockFusesResponse = {
  fuseObj: {
    CANNOT_UNWRAP: false,
    CANNOT_BURN_FUSES: false,
    CANNOT_TRANSFER: false,
    CANNOT_SET_RESOLVER: false,
    CANNOT_SET_TTL: false,
    CANNOT_CREATE_SUBDOMAIN: false,
    PARENT_CANNOT_CONTROL: true,
    canDoEverything: false,
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
    mockUseGetWrapperData.mockReturnValue({})
    render(<Fuses {...defaultProps} />)
  })

  it('should show warning if PCC has NOT been burned', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetWrapperData.mockReturnValue({
      wrapperData: {
        ...mockFusesResponse,
        fuseObj: { ...mockFusesResponse.fuseObj, PARENT_CANNOT_CONTROL: false },
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
