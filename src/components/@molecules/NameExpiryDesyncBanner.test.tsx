import { mockFunction, render, screen } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'

import { NameExpiryDesyncBanner } from './NameExpiryDesyncBanner'

vi.mock('wagmi')

const mockUseAccount = mockFunction(useAccount)

describe('NameExpiryDesyncBanner', () => {
  it('should render', () => {
    mockUseAccount.mockReturnValue({ isConnected: true })
    render(<NameExpiryDesyncBanner normalisedName="test.eth" />)
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('should show action button when connected', () => {
    mockUseAccount.mockReturnValue({ isConnected: true })
    render(<NameExpiryDesyncBanner normalisedName="test.eth" />)
    expect(screen.getByText('actionLabel')).toBeInTheDocument()
  })

  it('should not show action button when not connected', () => {
    mockUseAccount.mockReturnValue({ isConnected: false })
    render(<NameExpiryDesyncBanner normalisedName="test.eth" />)
    expect(screen.queryByText('actionLabel')).not.toBeInTheDocument()
  })
})
