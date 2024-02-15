import { fireEvent, mockFunction, render, screen } from '@app/test-utils'

import mockRouter from 'next-router-mock'
import { useAccount } from 'wagmi'

import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useInitial } from '@app/hooks/useInitial'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import Hamburger from './@molecules/Hamburger/Hamburger'
import { HeaderConnect } from './ConnectButton'
import { Header } from './Header'

vi.mock('next/router', async () => await vi.importActual('next-router-mock'))
vi.mock('@app/hooks/transactions/useRecentTransactions')
vi.mock('@app/hooks/useInitial')
vi.mock('@app/utils/BreakpointProvider')
vi.mock('./@molecules/Hamburger/Hamburger')
vi.mock('./ConnectButton')

const mockUseAccount = mockFunction(useAccount)
const mockUseRecentTransactions = mockFunction(useRecentTransactions)
const mockUseInitial = mockFunction(useInitial)
const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockHeaderConnect = mockFunction(HeaderConnect)
const mockHamburger = mockFunction(Hamburger)

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
  window.ResizeObserver = vi.fn()
  ;(window.ResizeObserver as jest.Mock).mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  }))
  mockRouter.setCurrentUrl('/test')
  mockUseAccount.mockReturnValue({
    isConnected: true,
  })
  mockUseRecentTransactions.mockReturnValue([])
  mockUseInitial.mockReturnValue(false)
  mockUseBreakpoint.mockReturnValue(baseBreakpoints)
  mockHeaderConnect.mockImplementation(() => <div>Connect</div>)
  mockHamburger.mockImplementation(() => <div>burger</div>)
  describe('search', () => {
    it('should expand on focus and hide icons if sm breakpoint', () => {
      render(<Header />)
      expect(screen.getByTestId('search-wrapper')).toHaveStyle('margin-right: 6rem')
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
