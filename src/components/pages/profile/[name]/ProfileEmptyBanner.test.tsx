import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useProfileActions } from '@app/hooks/pages/profile/[name]/profile/useProfileActions/useProfileActions'
import { useProfile } from '@app/hooks/useProfile'

import { ProfileEmptyBanner } from './ProfileEmptyBanner'

vi.mock('@app/hooks/useProtectedRoute', () => ({
  useProtectedRoute: vi.fn(),
}))
vi.mock('@app/utils/BreakpointProvider')
vi.mock('next/router', async () => await vi.importActual('next-router-mock'))
vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/pages/profile/[name]/profile/useProfileActions/useProfileActions')
vi.mock('@app/hooks/abilities/useAbilities', () => ({
  useAbilities: vi.fn(() => ({ data: { canEditRecords: true } })),
}))

const mockUseAbilities = mockFunction(useAbilities)
const mockUseProfile = mockFunction(useProfile)
const mockUseProfileActions = mockFunction(useProfileActions)

describe('ProfileEmptyBanner', () => {
  it('should not display banner if have records', () => {
    const name = 'test'

    mockUseProfile.mockImplementation(() => ({
      data: {
        texts: [
          {
            key: 'avatar',
            value: 'http://localhost:3000',
          },
        ],
        coins: [
          {
            id: 60,
            name: 'eth',
            value: '0x8327FcD61f5e90e1E05A3F49DCbc9346b7d111111',
          },
        ],
        contentHash: null,
        abi: null,
        resolverAddress: '0x8327FcD61f5e90e1E05A3F49DCbc9346b7d111112',
        isMigrated: true,
        createdAt: {
          date: '2024-08-02T10:33:00.000Z',
          value: 1722594780000,
        },
        address: '0x8327FcD61f5e90e1E05A3F49DCbc9346b7d175f7',
      },
      isLoading: false,
    }))

    mockUseProfileActions.mockImplementation(() => ({
      profileActions: [
        {
          label: 'tabs.profile.actions.editProfile.label',
        },
      ],
    }))

    render(<ProfileEmptyBanner name={name} />)
    expect(screen.queryByTestId('profile-empty-banner')).not.toBeInTheDocument()
  })

  it('should display banner if have no records', () => {
    const name = 'test'

    mockUseProfile.mockImplementation(() => ({
      data: {
        text: [],
        coins: [],
      },
      isLoading: false,
    }))

    mockUseProfileActions.mockImplementation(() => ({
      profileActions: [
        {
          label: 'tabs.profile.actions.editProfile.label',
        },
      ],
    }))

    render(<ProfileEmptyBanner name={name} />)
    expect(screen.queryByTestId('profile-empty-banner')).toBeInTheDocument()
  })

  it('should not display banner if cannot edit records', () => {
    const name = 'test'

    mockUseProfile.mockImplementation(() => ({
      data: {
        text: [],
        coins: [],
      },
      isLoading: false,
    }))

    mockUseProfileActions.mockImplementation(() => ({
      profileActions: [
        {
          label: 'tabs.profile.actions.editProfile.label',
        },
      ],
    }))

    mockUseAbilities.mockImplementationOnce(() => ({
      data: {
        canEditRecords: false,
      },
    }))

    render(<ProfileEmptyBanner name={name} />)
    expect(screen.queryByTestId('profile-empty-banner')).not.toBeInTheDocument()
  })
})
