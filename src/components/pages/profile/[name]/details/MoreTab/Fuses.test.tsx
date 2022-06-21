import { render, screen } from '@app/test-utils'

import { useRouter } from 'next/router'
import { useGetFuseData } from '@app/hooks/useGetFuseData'

import Fuses from './Fuses'

jest.mock('next/router')
jest.mock('@app/hooks/useGetFuseData')

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
  rawFuses: {
    type: 'BigNumber',
    hex: '0x40',
  },
}

describe('Fuses', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    useRouter.mockImplementation(() => {
      return {
        query: {
          name: 'nick.eth',
        },
      }
    })
    useGetFuseData.mockImplementation(() => {
      return {}
    })
    render(<Fuses />)
    expect(screen.getByText('Please wrap your name to unlock this feature'))
  })

  it('should show fuses if wrapped name', () => {
    useRouter.mockImplementation(() => {
      return {
        query: {
          name: 'nick.eth',
        },
      }
    })
    useGetFuseData.mockImplementation(() => {
      return { fuseData: mockFusesResponse }
    })
    render(<Fuses />)
    expect(screen.getByTestId('first-traffic-light')).toHaveStyle(
      'background-color: rgb(213,85,85)',
    )
  })

  it('should show vulerabilities', () => {
    useRouter.mockImplementation(() => {
      return {
        query: {
          name: 'nick.eth',
        },
      }
    })
    useGetFuseData.mockImplementation(() => {
      return { fuseData: mockFusesResponse }
    })
    render(<Fuses />)
    expect(screen.getByText('Safe'))
  })
})
