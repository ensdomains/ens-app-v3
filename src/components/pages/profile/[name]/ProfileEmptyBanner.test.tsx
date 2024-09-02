import { render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { AddressRecord } from '@app/types'

import { ProfileEmptyBanner } from './ProfileEmptyBanner'

vi.mock('@app/hooks/abilities/useAbilities', () => ({
  useAbilities: () => ({
    data: {
      canSendOwner: true,
      canSendManager: true,
      canEditRecords: true,
      sendNameFunctionCallDetails: {
        sendManager: {
          contract: 'contract',
        },
        sendOwner: {
          contract: 'contract',
        },
      },
    },
    isLoading: false,
  }),
}))
vi.mock('@app/hooks/useProtectedRoute', () => ({
  useProtectedRoute: vi.fn(),
}))
vi.mock('@app/utils/BreakpointProvider')
vi.mock('next/router', async () => await vi.importActual('next-router-mock'))

describe('ProfileEmptyBanner', () => {
  it('should not display banner if have addresses', () => {
    const name = 'test'
    const addresses: AddressRecord[] = [
      {
        id: 1,
        name: 'ADR1',
        value: 'addr1-value',
      },
    ]
    render(<ProfileEmptyBanner name={name} addresses={addresses} />)
    expect(screen.queryByTestId('profile-empty-banner')).not.toBeInTheDocument()
  })
  it('should display banner if have no addresses', () => {
    const name = 'test'
    const addresses: AddressRecord[] = []

    render(<ProfileEmptyBanner name={name} addresses={addresses} />)
    expect(screen.queryByTestId('profile-empty-banner')).toBeInTheDocument()
  })
})
