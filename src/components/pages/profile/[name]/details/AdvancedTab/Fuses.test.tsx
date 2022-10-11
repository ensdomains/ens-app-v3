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
    render(<Fuses />)
    expect(screen.getByText('fuses.callToAction')).toBeVisible()
  })

  it('should show fuses if wrapped name', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetWrapperData.mockReturnValue({ wrapperData: mockFusesResponse })
    render(<Fuses />)
    expect(screen.getByTestId('first-traffic-light')).toHaveStyle(
      'background-color: rgb(213,85,85)',
    )
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
    render(<Fuses />)
    expect(screen.getByText('fuses.permissions.warning')).toBeVisible()
  })
})
