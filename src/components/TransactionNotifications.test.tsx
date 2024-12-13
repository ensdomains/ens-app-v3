import { mockFunction, render, screen, waitFor } from '@app/test-utils'

import { act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useChainName } from '@app/hooks/chain/useChainName'
import type { Transaction } from '@app/hooks/transactions/transactionStore'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { UpdateCallback, useCallbackOnTransaction } from '@app/utils/SyncProvider/SyncProvider'

import { TransactionNotifications } from './TransactionNotifications'

vi.mock('@app/hooks/chain/useChainName')
vi.mock('@app/utils/SyncProvider/SyncProvider')
vi.mock('@app/utils/BreakpointProvider')

const mockUseChainName = mockFunction(useChainName)
const mockUseCallbackOnTransaction = mockFunction(useCallbackOnTransaction)
const mockUseBreakpoint = mockFunction(useBreakpoint)

vi.useFakeTimers()

const makeRecentTransaction =
  (status = 'confirmed') =>
  (_: any, i: number) =>
    ({
      status,
      action: `test-action-${i}`,
      key: 'any',
      hash: `0x${i.toString(16).padStart(32, '0')}`,
    }) as Transaction

window.scroll = vi.fn() as () => void
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let cb: UpdateCallback = (_) => {}
mockUseCallbackOnTransaction.mockImplementation((_cb: UpdateCallback) => (cb = _cb))

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
    render(<TransactionNotifications />)
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()
  })
  it('should render a toast when a pending transaction is confirmed', async () => {
    const { rerender } = render(<TransactionNotifications />)
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()

    cb(makeRecentTransaction('confirmed')(null, 0))
    rerender(<TransactionNotifications />)

    await waitFor(() => screen.queryByTestId('toast-desktop'), {
      timeout: 500,
    }).then((el) => expect(el).toBeInTheDocument())
  })
  it('should show a new notification on dismiss if there is one queued', async () => {
    const mockData = Array.from({ length: 2 }, makeRecentTransaction('pending'))

    const { rerender } = render(<TransactionNotifications />)
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()

    cb({ ...mockData[0], status: 'confirmed1' as any })
    cb({ ...mockData[1], status: 'confirmed2' as any })

    rerender(<TransactionNotifications />)

    await waitFor(() => screen.queryByText('transaction.status.confirmed1.notifyTitle'), {
      timeout: 500,
    }).then((el) => expect(el).toBeInTheDocument())

    act(() => {
      vi.advanceTimersByTime(8350)
    })

    await waitFor(() => screen.queryByText('transaction.status.confirmed2.notifyTitle'), {
      timeout: 500,
    }).then((el) => expect(el).toBeInTheDocument())
  })
  it('should show the correct title and description for a notification', async () => {
    const { rerender } = render(<TransactionNotifications />)

    const mockData = makeRecentTransaction('confirmed')(null, 0)
    cb(mockData)

    rerender(<TransactionNotifications />)

    await waitFor(() => screen.queryByTestId('toast-desktop'), {
      timeout: 500,
    }).then((el) => expect(el).toBeInTheDocument())

    expect(screen.getByText('transaction.status.confirmed.notifyTitle')).toBeInTheDocument()
    expect(screen.getByText('transaction.status.confirmed.notifyMessage')).toBeInTheDocument()
  })
  it('should not show a notification for a repriced transaction', async () => {
    const { rerender } = render(<TransactionNotifications />)

    const mockData = makeRecentTransaction('repriced')(null, 0)
    cb(mockData)

    rerender(<TransactionNotifications />)

    await waitFor(() => screen.queryByTestId('toast-desktop'), {
      timeout: 500,
    }).then((el) => expect(el).not.toBeInTheDocument())
  })
})
