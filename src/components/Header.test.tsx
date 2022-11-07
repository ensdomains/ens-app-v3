import { fireEvent, mockFunction, render, screen } from '@app/test-utils'

import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useInitial } from '@app/hooks/useInitial'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { HeaderConnect } from './ConnectButton'
import { Header } from './Header'

jest.mock('next/router')
jest.mock('@app/hooks/transactions/useRecentTransactions')
jest.mock('@app/hooks/useInitial')
jest.mock('@app/utils/BreakpointProvider')
jest.mock('./ConnectButton')

const mockRouter = mockFunction(useRouter)
const mockUseAccount = mockFunction(useAccount)
const mockUseRecentTransactions = mockFunction(useRecentTransactions)
const mockUseInitial = mockFunction(useInitial)
const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockHeaderConnect = mockFunction(HeaderConnect)

const baseBreakpoints: ReturnType<typeof useBreakpoint> = {
  xs: true,
  sm: true,
  md: true,
  lg: false,
  xl: false,
}

const checkRoutesPlacement = (visible: boolean) => {
  const container = screen.queryByTestId('route-container')
  expect(container).toHaveStyle(
    visible ? 'transform: translateX(0%)' : 'transform: translateX(125%)',
  )
}

describe('Header', () => {
  window.ResizeObserver = jest.fn()
  ;(window.ResizeObserver as jest.Mock).mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }))
  mockRouter.mockReturnValue({
    asPath: '/test',
    query: {},
  })
  mockUseAccount.mockReturnValue({
    isConnected: true,
  })
  mockUseRecentTransactions.mockReturnValue([])
  mockUseInitial.mockReturnValue(false)
  mockUseBreakpoint.mockReturnValue(baseBreakpoints)
  mockHeaderConnect.mockImplementation(() => <div>Connect</div>)
  describe('search', () => {
    it('should expand on focus and hide icons if md breakpoint', () => {
      render(<Header />)
      expect(screen.getByTestId('search-wrapper')).toHaveStyle('margin-right: 8rem')
      checkRoutesPlacement(true)

      fireEvent.focus(screen.getByTestId('search-input-box'))
      expect(screen.getByTestId('search-wrapper')).toHaveStyle('margin-right: 0px')
      checkRoutesPlacement(false)
    })
    it('should not not hide route items if larger than md breakpoint', () => {
      mockUseBreakpoint.mockReturnValue({ ...baseBreakpoints, lg: true, xl: true })
      render(<Header />)
      checkRoutesPlacement(true)

      fireEvent.focus(screen.getByTestId('search-input-box'))
      checkRoutesPlacement(true)
    })
  })
})
