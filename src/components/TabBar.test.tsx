/* eslint-disable no-promise-executor-return */
import { mockFunction, render, screen } from '@app/test-utils'

import mockRouter from 'next-router-mock'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { TabBar } from './TabBar'

vi.mock('next/router', async () => await vi.importActual('next-router-mock'))
vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi')
  return {
    ...actual,
  }
})
vi.mock('@app/transaction-flow/transaction')
vi.mock('@app/hooks/transactions/TransactionStoreContext')
vi.mock('@app/utils/BreakpointProvider')
vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/ensjs/public/usePrimaryName', () => ({
  usePrimaryName: ({ address }: { address: unknown }) => mockUsePrimary({ address }),
}))

const mockUseAccountSafely = mockFunction(useAccountSafely)
const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUsePrimary = vi.fn().mockImplementation(({}) => {
  return {
    data: { beautifiedName: 'test.eth', name: 'test.eth' },
    isLoading: false,
  }
})

const baseBreakpoints: ReturnType<typeof useBreakpoint> = {
  xs: true,
  sm: true,
  md: true,
  lg: false,
  xl: false,
}

describe('TabBar', () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue(baseBreakpoints)
  })

  it('should render connect button if no address is present', () => {
    mockUseAccountSafely.mockReturnValue({})
    render(<TabBar />)
    expect(screen.queryByTestId('tabbar-connect-button')).toBeInTheDocument()
  })

  it('should not render connect button if no address is present', () => {
    mockUseAccountSafely.mockReturnValue({ address: '0x1234' })
    mockRouter.setCurrentUrl('/?from=from')
    render(<TabBar />)
    expect(screen.queryByTestId('tabbar-connect-button')).not.toBeInTheDocument()
  })

  it('should render back button if has from query', () => {
    mockRouter.setCurrentUrl('/?from=from')
    render(<TabBar />)
    expect(screen.queryByTestId('tabbar-back')).toBeInTheDocument()
  })
})
