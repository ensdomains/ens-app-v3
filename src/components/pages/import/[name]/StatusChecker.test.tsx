import { fireEvent, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { StatusChecker } from './StatusChecker'

describe('StatusChecker', () => {
  it('calls refetch on refetch button press', () => {
    const refetchMock = vi.fn()
    render(
      <StatusChecker
        refetch={refetchMock}
        isLoading={false}
        isRefetching={false}
        dataUpdatedAt={1234567890}
        errorUpdatedAt={undefined}
        message="Test message"
      />,
    )

    fireEvent.click(screen.getByTestId('status-refetch'))

    expect(refetchMock).toHaveBeenCalled()
  })

  it('shows checking message when refetching', () => {
    render(
      <StatusChecker
        refetch={() => {}}
        isLoading={false}
        isRefetching={true}
        dataUpdatedAt={1234567890}
        errorUpdatedAt={undefined}
        message="Test message"
      />,
    )

    expect(screen.getByText('status.checking')).toBeInTheDocument()
  })

  it('shows seconds ago when updated less than 60 seconds ago', () => {
    render(
      <StatusChecker
        refetch={() => {}}
        isLoading={false}
        isRefetching={false}
        dataUpdatedAt={Date.now() - 30000} // 30 seconds ago
        errorUpdatedAt={undefined}
        message="Test message"
      />,
    )

    expect(screen.getByText('status.secondsAgo')).toBeInTheDocument()
  })

  it('shows minutes ago when updated less than 60 minutes ago', () => {
    render(
      <StatusChecker
        refetch={() => {}}
        isLoading={false}
        isRefetching={false}
        dataUpdatedAt={Date.now() - 1800000} // 30 minutes ago
        errorUpdatedAt={undefined}
        message="Test message"
      />,
    )

    expect(screen.getByText('status.minutesAgo.30')).toBeInTheDocument()
  })

  it('shows a while ago when updated more than 60 minutes ago', () => {
    render(
      <StatusChecker
        refetch={() => {}}
        isLoading={false}
        isRefetching={false}
        dataUpdatedAt={Date.now() - 7200000} // 2 hours ago
        errorUpdatedAt={undefined}
        message="Test message"
      />,
    )

    expect(screen.getByText('status.aWhileAgo')).toBeInTheDocument()
  })

  it('should use the errorUpdatedAt if dataUpdatedAt is not available', () => {
    render(
      <StatusChecker
        refetch={() => {}}
        isLoading={false}
        isRefetching={false}
        dataUpdatedAt={undefined}
        errorUpdatedAt={1234567890}
        message="Test message"
      />,
    )

    expect(screen.getByText('status.aWhileAgo')).toBeInTheDocument()
  })
})
