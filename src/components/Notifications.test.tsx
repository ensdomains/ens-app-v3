import { mockFunction, render, screen, waitFor } from '@app/test-utils'

import { act } from '@testing-library/react'

import { Transaction } from '@app/hooks/transactions/transactionStore'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useChainName } from '@app/hooks/useChainName'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { Notifications } from './Notifications'

jest.mock('@app/hooks/useChainName')
jest.mock('@app/hooks/transactions/useRecentTransactions')
jest.mock('@app/utils/BreakpointProvider')

const mockUseChainName = mockFunction(useChainName)
const mockUseRecentTransactions = mockFunction(useRecentTransactions)
const mockUseBreakpoint = mockFunction(useBreakpoint)

jest.useFakeTimers()

const makeRecentTransaction =
  (status = 'confirmed') =>
  (_: any, i: number) =>
    ({
      status,
      action: `test-action-${i}`,
      key: 'any',
      hash: `0x${i.toString(16).padStart(32, '0')}`,
    } as Transaction)

window.scroll = jest.fn()

describe('Notifications', () => {
  mockUseBreakpoint.mockReturnValue({
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: false,
  })
  mockUseChainName.mockReturnValue('mainnet')
  it('should not render a toast if there is no transactions', () => {
    mockUseRecentTransactions.mockReturnValue([])
    render(<Notifications />)
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()
  })
  it('should render a toast when a pending transaction is confirmed', async () => {
    const mockData = makeRecentTransaction('pending')(null, 0)
    mockUseRecentTransactions.mockReturnValue([mockData])

    const { rerender } = render(<Notifications />)
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()

    mockData.status = 'confirmed'
    mockUseRecentTransactions.mockReturnValue([mockData])
    rerender(<Notifications />)

    await waitFor(() => screen.queryByTestId('toast-desktop'), {
      timeout: 500,
    }).then((el) => expect(el).toBeInTheDocument())
  })
  it('should show a new notification on dismiss if there is one queued', async () => {
    const mockData = Array.from({ length: 2 }, makeRecentTransaction('pending'))
    mockUseRecentTransactions.mockReturnValue(mockData)

    const { rerender } = render(<Notifications />)
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()

    mockUseRecentTransactions.mockReturnValue([
      { ...mockData[0], status: 'confirmed1' as any },
      { ...mockData[1], status: 'confirmed2' as any },
    ])
    rerender(<Notifications />)

    await waitFor(() => screen.queryByText('transaction.status.confirmed1.notifyTitle'), {
      timeout: 500,
    }).then((el) => expect(el).toBeInTheDocument())

    act(() => {
      jest.advanceTimersByTime(8350)
    })

    await waitFor(() => screen.queryByText('transaction.status.confirmed2.notifyTitle'), {
      timeout: 500,
    }).then((el) => expect(el).toBeInTheDocument())
  })
  it('should show the correct title and description for a notification', async () => {
    const mockData = makeRecentTransaction('pending')(null, 0)
    mockUseRecentTransactions.mockReturnValue([mockData])

    const { rerender } = render(<Notifications />)

    mockData.status = 'confirmed'
    mockUseRecentTransactions.mockReturnValue([mockData])
    rerender(<Notifications />)

    await waitFor(() => screen.queryByTestId('toast-desktop'), {
      timeout: 500,
    }).then((el) => expect(el).toBeInTheDocument())

    expect(screen.getByText('transaction.status.confirmed.notifyTitle')).toBeInTheDocument()
    expect(screen.getByText('transaction.status.confirmed.notifyMessage')).toBeInTheDocument()
  })
})
