import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, Mock, vi } from 'vitest'

import { useBasicName } from '@app/hooks/useBasicName'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProfile } from '@app/hooks/useProfile'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import ProfileContent, { NameAvailableBanner } from './Profile'

vi.mock('@app/hooks/useBasicName')
vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/useNameDetails')
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))
vi.mock('@app/hooks/useProtectedRoute', () => ({
  useProtectedRoute: vi.fn(),
}))
vi.mock('@app/utils/BreakpointProvider')
vi.mock('next/router', async () => await vi.importActual('next-router-mock'))
const mockUseBreakpoint = mockFunction(useBreakpoint)
const baseBreakpoints: ReturnType<typeof useBreakpoint> = {
  xs: true,
  sm: true,
  md: true,
  lg: false,
  xl: false,
}
const mockUseBasicName = mockFunction(useBasicName)
const mockUseProfile = mockFunction(useProfile)
const mockUseNameDetails = mockFunction(useNameDetails)

describe('ProfileContent - Unsupported TLDs', () => {
  it('should display the expiry date of the name', () => {
    const date = new Date(0)
    render(<NameAvailableBanner {...{ normalisedName: 'nick.eth', expiryDate: date }} />)
    expect(
      screen.getByText('1970', {
        exact: false,
      }),
    ).toBeVisible()
  })
  it('should show only the "profile" tab for unsupported TLDs', () => {
    window.ResizeObserver = vi.fn()
    ;(window.ResizeObserver as Mock).mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    }))
    mockUseBreakpoint.mockReturnValue({ ...baseBreakpoints, lg: true, xl: true })
    mockUseBasicName.mockReturnValue({
      isValid: true,
      name: 'test',
      normalisedName: 'test',
    })
    mockUseProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
    })
    mockUseNameDetails.mockReturnValue({
      unsupported: true,
      name: 'test.unsupportedTLD',
      is2LD: false,
      isValid: true,
      normalisedName: 'test.unsupportedTLD',
    })

    render(<ProfileContent isSelf={false} isLoading={false} name={'test.unsupportedTLD'} />)

    // Check for the visibility of tabs
    expect(screen.queryByTestId('profile-tab')).toBeInTheDocument()
    expect(screen.queryByTestId('records-tab')).not.toBeInTheDocument()
    expect(screen.queryByTestId('ownership-tab')).not.toBeInTheDocument()
    expect(screen.queryByTestId('subnames-tab')).not.toBeInTheDocument()
    expect(screen.queryByTestId('permissions-tab')).not.toBeInTheDocument()
    expect(screen.queryByTestId('more-tab')).not.toBeInTheDocument()
  })
})
