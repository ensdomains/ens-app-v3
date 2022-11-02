import { mockFunction, render } from '@app/test-utils'

import { useAccount } from 'wagmi'

import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useActiveRoute } from '@app/hooks/useActiveRoute'

import { TabBar } from './TabBar'

jest.mock('wagmi')
jest.mock('@app/hooks/transactions/useRecentTransactions')
jest.mock('@app/hooks/useActiveRoute')

const mockUseAccount = mockFunction(useAccount)
const mockUseActiveRoute = mockFunction(useActiveRoute)
const mockUseRecentTransactions = mockFunction(useRecentTransactions)

describe('TabBar', () => {
  mockUseActiveRoute.mockReturnValue('profile')
  mockUseRecentTransactions.mockReturnValue([])

  it('should return null if useAccount is connecting', () => {
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnecting: true,
      isReconnecting: false,
    })

    const { container } = render(<TabBar />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should return null if useAccount is reconnecting', () => {
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnecting: false,
      isReconnecting: true,
    })

    const { container } = render(<TabBar />)
    expect(container).toBeEmptyDOMElement()
  })
})
