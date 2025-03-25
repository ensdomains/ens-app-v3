import mockRouter from 'next-router-mock'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { shouldRedirect } from './shouldRedirect'

vi.mock('next/router', async () => await vi.importActual('next-router-mock'))

describe('shouldRedirect', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/')
  })

  // check router.push or router.place is called with the expected argument
  it('DotBoxRegistration.tsx should return expected path if has valid arguments', () => {
    const name = 'test'
    const params = {
      isLoading: false,
      data: {
        data: {},
      },
    }

    shouldRedirect(
      mockRouter as never,
      'DotBoxRegistration.tsx',
      `/profile/${name}`,
      params as never,
    )

    expect(mockRouter.pathname).toBe(`/profile/${name}`)
  })
  it('DotBoxRegistration.tsx should not return expected path if has valid arguments', () => {
    const name = 'test'
    const params = {
      isLoading: false,
      data: {
        data: {
          status: 'AVAILABLE',
          // status: 'UNAVAILABLE',
        },
      },
    }

    shouldRedirect(
      mockRouter as never,
      'DotBoxRegistration.tsx',
      `/profile/${name}`,
      params as never,
    )

    expect(mockRouter.pathname).toBe(`/`)
  })

  it('DnsClaim.tsx should return "/" path if has valid arguments', () => {
    const params = {
      shouldRun: true,
      payload: {
        item: { name: '.box' },
      },
    }
    shouldRedirect(mockRouter as never, 'DnsClaim.tsx', '', params as never)
    expect(mockRouter.pathname).toBe(`/`)
  })

  it('DnsClaim.tsx should "/profile/[name]" expected path if has valid arguments', () => {
    const name = 'test'
    const params = {
      shouldRun: true,
      payload: {
        name,
        isLoading: false,
        registrationStatus: 'invalid',
        item: { name: '.eth' },
        step: 'transaction',
      },
    }
    shouldRedirect(mockRouter as never, 'DnsClaim.tsx', '', params as never)
    expect(mockRouter.pathname).toBe(`/profile/${name}`)
  })

  it('Profile.tsx should "/profile/[decodedName]" expected path if has valid arguments', () => {
    const name = 'test'
    const decodedName = 'test.eth'
    const normalisedName =
      '[fa1ea47215815692a5f1391cff19abbaf694c82fb2151a4c351b6c0eeaaf317b].test.eth'
    const params = {
      name,
      isSelf: false,
      decodedName,
      normalisedName,
      visibileTabs: ['profile', 'records', 'ownership', 'subnames', 'more'],
      tab: 'profile',
    }
    shouldRedirect(mockRouter as never, 'Profile.tsx', '/profile', params)
    expect(mockRouter.pathname).toBe(`/profile/${decodedName}`)
  })

  it('Profile.tsx should "/profile/[normalisedName]" expected path if has valid arguments', () => {
    const name = 'test'
    const decodedName = ''
    const normalisedName =
      '[fa1ea47215815692a5f1391cff19abbaf694c82fb2151a4c351b6c0eeaaf317b].test.eth'
    const params = {
      name,
      isSelf: false,
      decodedName,
      normalisedName,
      visibileTabs: ['profile', 'records', 'ownership', 'subnames', 'more'],
      tab: 'profile',
    }
    shouldRedirect(mockRouter as never, 'Profile.tsx', '/profile', params)
    expect(mockRouter.pathname).toBe(`/profile/${normalisedName}`)
  })

  it('Profile.tsx should "/profile/[name]" expected path if has valid arguments', () => {
    const name = 'test'
    const decodedName = 'test.eth'
    const normalisedName =
      '[fa1ea47215815692a5f1391cff19abbaf694c82fb2151a4c351b6c0eeaaf317b].test.eth'
    const params = {
      name,
      isSelf: true,
      decodedName,
      normalisedName,
      visibileTabs: ['profile', 'records', 'ownership', 'subnames', 'more'],
      tab: 'profile',
    }
    shouldRedirect(mockRouter as never, 'Profile.tsx', '/profile', params)
    expect(mockRouter.pathname).toBe(`/profile/${name}`)
  })

  it('Profile.tsx should "/profile/[name]" expected path if invalid tab', () => {
    const name = 'test'
    const decodedName = 'test.eth'
    const normalisedName =
      '[fa1ea47215815692a5f1391cff19abbaf694c82fb2151a4c351b6c0eeaaf317b].test.eth'
    const params = {
      name,
      isSelf: true,
      decodedName,
      normalisedName,
      visibileTabs: ['profile', 'records', 'ownership', 'subnames', 'more'],
      tab: 'custom',
    }
    shouldRedirect(mockRouter as never, 'Profile.tsx', '/profile', params)
    expect(mockRouter.pathname).toBe(`/profile/${name}`)
  })
})
