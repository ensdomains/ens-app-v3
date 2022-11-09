import { mockFunction, render } from '@app/test-utils'

import { useAccount } from 'wagmi'

import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useActiveRoute } from '@app/hooks/useActiveRoute'
import { useInitial } from '@app/hooks/useInitial'

import { TabBar } from './TabBar'

jest.mock('wagmi')
jest.mock('@app/hooks/transactions/useRecentTransactions')
jest.mock('@app/hooks/useActiveRoute')
jest.mock('@app/hooks/useInitial')

const mockUseAccount = mockFunction(useAccount)
const mockUseActiveRoute = mockFunction(useActiveRoute)
const mockUseRecentTransactions = mockFunction(useRecentTransactions)
const mockUseInitial = mockFunction(useInitial)

describe('TabBar', () => {
  mockUseActiveRoute.mockReturnValue('profile')
  mockUseRecentTransactions.mockReturnValue([])
  mockUseAccount.mockReturnValue({ address: '0x123' })

  it('should return null if useInitial is true', () => {
    mockUseInitial.mockReturnValue(true)

    const { container } = render(<TabBar />)
    expect(container).toBeEmptyDOMElement()
  })
})
