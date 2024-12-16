import { mockFunction, render, screen } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'

import { NetworkNotifications } from './NetworkNotifications'
import { shouldOpenModal } from './utils'

vi.mock('wagmi')
const mockUseAccount = mockFunction(useAccount)

// const mockShouldOpenModal = vi.fn()

vi.mock('./utils', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    shouldOpenModal: vi.fn(),
  }
})

describe('NetworkNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show notification if shouldOpenModal sets true', () => {
    vi.mocked(shouldOpenModal).mockReturnValue(true)
    render(<NetworkNotifications />)
    expect(screen.getByTestId('toast-desktop')).toBeInTheDocument()
  })

  it('should not show notification if shouldOpenModal sets false', () => {
    vi.mocked(shouldOpenModal).mockReturnValue(false)
    mockUseAccount.mockReturnValue({
      chain: {
        name: 'ethereum',
        id: 1,
      },
    })

    render(<NetworkNotifications />)
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()
  })
})
