import { mockFunction, render, screen } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount, useChainId } from 'wagmi'

import { NetworkNotifications } from './NetworkNotifications'
import { shouldOpenModal } from './utils'

vi.mock('wagmi')
const mockUseAccount = mockFunction(useAccount)
const mockUseChainId = mockFunction(useChainId)

vi.mock('./utils', async (importOriginal) => {
  const actual = await importOriginal<any>()
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
    mockUseAccount.mockReturnValue({
      chainId: 1,
    })
    mockUseChainId.mockReturnValue(1)
    render(<NetworkNotifications />)
    expect(screen.getByTestId('toast-desktop')).toBeInTheDocument()
  })

  it('should not show notification if shouldOpenModal sets false', () => {
    vi.mocked(shouldOpenModal).mockReturnValue(false)
    mockUseAccount.mockReturnValue({
      chainId: 1,
    })
    mockUseChainId.mockReturnValue(1)

    render(<NetworkNotifications />)
    expect(screen.queryByTestId('toast-desktop')).not.toBeInTheDocument()
  })
})
