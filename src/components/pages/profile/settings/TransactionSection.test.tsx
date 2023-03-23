import { mockFunction, render, screen, waitFor } from '@app/test-utils'

import { act } from '@testing-library/react'
import React from 'react'

import type { Transaction } from '@app/hooks/transactions/transactionStore'
import { useClearRecentTransactions } from '@app/hooks/transactions/useClearRecentTransactions'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useChainName } from '@app/hooks/useChainName'

import { TransactionSection } from './TransactionSection'

jest.mock('@app/hooks/useChainName')
jest.mock('@app/hooks/transactions/useClearRecentTransactions')
jest.mock('@app/hooks/transactions/useRecentTransactions')

const mockUseChainName = mockFunction(useChainName)
const mockUseClearRecentTransactions = mockFunction(useClearRecentTransactions)
const mockUseRecentTransactions = mockFunction(useRecentTransactions)

const mockClearTransactions = jest.fn()

const makeRecentTransaction =
  (status = 'confirmed') =>
  (_: any, i: number) =>
    ({
      status,
      action: `test-action-${i}`,
      hash: `0x${i.toString(16).padStart(32, '0')}`,
    } as Transaction)

describe('TransactionSection', () => {
  mockUseChainName.mockReturnValue('mainnet')
  mockUseClearRecentTransactions.mockReturnValue(mockClearTransactions)

  beforeAll(() => {
    Element.prototype.getBoundingClientRect = () =>
      ({
        width: 300,
        height: 300,
      } as any)
  })

  it('should render', () => {
    mockUseRecentTransactions.mockReturnValue([])
    render(<TransactionSection />)
    expect(screen.getByTestId('transaction-section')).toBeVisible()
    expect(screen.getByText('section.transaction.title')).toBeVisible()
    expect(screen.getByText('section.transaction.noRecentTransactions')).toBeVisible()
  })

  it('should only show 5 transactions on initial render', () => {
    mockUseRecentTransactions.mockReturnValue(Array.from({ length: 9 }, makeRecentTransaction()))
    render(<TransactionSection />)
    expect(screen.getAllByTestId('transaction-confirmed')).toHaveLength(5)
  })

  it('should have correct height when "View More" button is visiable', async () => {
    mockUseRecentTransactions.mockReturnValue(Array.from({ length: 9 }, makeRecentTransaction()))
    render(<TransactionSection />)
    const element = screen.getByTestId('transaction-section-container')
    await waitFor(() => {
      expect(element).toHaveStyle(`height: 300px;`)
    })
  })
  it('should have correct height when "View More" button is NOT visiable', async () => {
    mockUseRecentTransactions.mockReturnValue(Array.from({ length: 4 }, makeRecentTransaction()))
    render(<TransactionSection />)
    const element = screen.getByTestId('transaction-section-container')
    await waitFor(() => {
      expect(element).toHaveStyle(`height: 300px;`)
    })
  })
  it('should not show View More button if there is less than 5 transactions', () => {
    mockUseRecentTransactions.mockReturnValue(Array.from({ length: 4 }, makeRecentTransaction()))
    render(<TransactionSection />)
    expect(screen.queryByTestId('transaction-view-more-button')).not.toBeInTheDocument()
  })
  it('should show more transactions after clicking view more', () => {
    mockUseRecentTransactions.mockReturnValue(Array.from({ length: 9 }, makeRecentTransaction()))
    render(<TransactionSection />)
    act(() => {
      screen.getByTestId('transaction-view-more-button').click()
    })

    expect(screen.getAllByTestId('transaction-confirmed')).toHaveLength(9)
  })
  it('should show a loading spinner for pending transactions', () => {
    mockUseRecentTransactions.mockReturnValue(
      Array.from({ length: 1 }, makeRecentTransaction('pending')),
    )
    render(<TransactionSection />)
    expect(screen.getByTestId('pending-spinner')).toBeVisible()
  })
  it('should show the clear button as disabled if there are no transactions', () => {
    mockUseRecentTransactions.mockReturnValue([])
    render(<TransactionSection />)
    expect(screen.getByTestId('transaction-clear-button')).toBeDisabled()
  })
  it('should call clearRecentTransactions if clear is pressed', () => {
    mockUseRecentTransactions.mockReturnValue(Array.from({ length: 1 }, makeRecentTransaction()))
    render(<TransactionSection />)
    act(() => {
      screen.getByTestId('transaction-clear-button').click()
    })
    expect(mockClearTransactions).toHaveBeenCalled()
  })
})
