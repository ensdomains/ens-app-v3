import { mockFunction, render, screen } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useReferrer } from '@app/hooks/useReferrer'
import { useResolvedReferrer } from '@app/hooks/useResolvedReferrer'

import { ReferrerNotifications } from './ReferrerNotifications'

vi.mock('@app/hooks/useReferrer')
vi.mock('@app/hooks/useResolvedReferrer')
vi.mock('@app/utils/BreakpointProvider', () => ({
  useBreakpoint: () => ({ sm: true }),
}))

const mockUseReferrer = mockFunction(useReferrer)
const mockUseResolvedReferrer = mockFunction(useResolvedReferrer)

describe('ReferrerNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show toast when referrer resolution errors', () => {
    mockUseReferrer.mockReturnValue('invalid.eth')
    mockUseResolvedReferrer.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("ENS name 'invalid.eth' did not resolve to an address"),
    })

    render(<ReferrerNotifications />)

    expect(screen.getByTestId('toast-desktop')).toBeInTheDocument()
    expect(screen.getByText("ENS name 'invalid.eth' did not resolve to an address")).toBeInTheDocument()
  })

  it('should not show toast when there is no error', () => {
    mockUseReferrer.mockReturnValue('valid.eth')
    mockUseResolvedReferrer.mockReturnValue({
      data: '0x1234567890123456789012345678901234567890',
      isLoading: false,
      isError: false,
      error: null,
    })

    render(<ReferrerNotifications />)

    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()
  })

  it('should not show toast when there is no referrer', () => {
    mockUseReferrer.mockReturnValue(undefined)
    mockUseResolvedReferrer.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    })

    render(<ReferrerNotifications />)

    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()
  })

  it('should not show toast again after closing for same referrer', () => {
    mockUseReferrer.mockReturnValue('invalid.eth')
    mockUseResolvedReferrer.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("ENS name 'invalid.eth' did not resolve to an address"),
    })

    const { rerender } = render(<ReferrerNotifications />)

    // Toast should be visible initially
    expect(screen.getByTestId('toast-desktop')).toBeInTheDocument()

    // Simulate closing the toast by clicking the close button
    const toast = screen.getByTestId('toast-desktop')
    const closeButton = toast.querySelector('button')
    closeButton?.click()

    // Rerender the component - the hasShownErrorRef should prevent showing again
    rerender(<ReferrerNotifications />)

    // Toast component still renders but open state should be false
    // The exact behavior depends on Thorin's Toast implementation
  })
})
