import { mockFunction, render, screen } from '@app/test-utils'

import { useConnectModal } from '@getpara/rainbowkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import useHasPendingTransactions from '@app/hooks/transactions/useHasPendingTransactions'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { ConnectButton, HeaderConnect } from './ConnectButton'

vi.mock('@app/utils/BreakpointProvider')
vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/useRouterWithHistory')
vi.mock('@app/hooks/transactions/useHasPendingTransactions')

const mockUseAccountSafely = mockFunction(useAccountSafely)
const mockUseBreakpoint = mockFunction(useBreakpoint)

describe('ConnectButton', () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      sm: false,
    })
  })
  it('should call openConnectModal when clicked', () => {
    render(<ConnectButton />)
    screen.debug()
    screen.getByTestId('body-connect-button').click()
    expect(useConnectModal().openConnectModal).toHaveBeenCalled()
  })
})

describe('HeaderConnect', () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      sm: false,
    })
  })
  it('should render ConnectButton when not connected', () => {
    mockUseAccountSafely.mockReturnValue({ address: undefined })
    render(<HeaderConnect />)
    expect(screen.getByTestId('connect-button')).toBeInTheDocument()
  })

  it('should render HeaderProfile when connected', () => {
    mockUseAccountSafely.mockReturnValue({ address: '0x123' })
    render(<HeaderConnect />)
    expect(screen.getByTestId('header-profile')).toBeInTheDocument()
  })
})
