import { useGetFuseData } from '@app/hooks/useGetFuseData'
import { mockFunction, render, screen } from '@app/test-utils'
import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'
import Fuses from './Fuses'

jest.mock('next/router')
jest.mock('@app/hooks/useGetFuseData')

const mockUseRouter = mockFunction(useRouter)
const mockUseGetFuseData = mockFunction(useGetFuseData)

const mockFusesResponse = {
  fuseObj: {
    cannotUnwrap: false,
    cannotBurnFuses: false,
    cannotTransfer: false,
    cannotSetResolver: false,
    cannotSetTtl: false,
    cannotCreateSubdomain: false,
    parentCannotControl: true,
    canDoEverything: false,
  },
  vulnerability: 'Safe',
  vulnerableNode: null,
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
    mockUseGetFuseData.mockReturnValue({})
    render(<Fuses />)
    expect(screen.getByText('fuses.callToAction')).toBeVisible()
  })

  it('should show fuses if wrapped name', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetFuseData.mockReturnValue({ fuseData: mockFusesResponse })
    render(<Fuses />)
    expect(screen.getByTestId('first-traffic-light')).toHaveStyle(
      'background-color: rgb(213,85,85)',
    )
  })

  it.todo('should show warning if PCC has NOT been burned')
})
