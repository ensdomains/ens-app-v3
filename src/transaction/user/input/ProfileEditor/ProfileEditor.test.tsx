/* eslint-disable no-await-in-loop */
import { cleanup, mockFunction, render, screen, userEvent, waitFor, within } from '@app/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEnsAvatar } from 'wagmi'

import ensjsPackage from '@app/../node_modules/@ensdomains/ensjs/package.json'
import appPackage from '@app/../package.json'
import { useContractAddress } from '@app/hooks/chain/useContractAddress'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useIsWrapped } from '@app/hooks/useIsWrapped'
import { useProfile } from '@app/hooks/useProfile'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import ProfileEditor from './ProfileEditor-flow'

vi.mock('wagmi')

const mockProfileData = {
  data: {
    address: '0x70643CB203137b9b9eE19deA56080CD2BA01dBFd' as const,
    contentHash: null,
    texts: [
      {
        key: 'email',
        value: 'test@ens.domains',
      },
      {
        key: 'url',
        value: 'https://ens.domains',
      },
      {
        key: 'avatar',
        value: 'https://example.xyz/avatar/test.jpg',
      },
      {
        key: 'com.discord',
        value: 'test',
      },
      {
        key: 'com.reddit',
        value: 'https://www.reddit.com/user/test/',
      },
      {
        key: 'com.twitter',
        value: 'https://twitter.com/test',
      },
      {
        key: 'org.telegram',
        value: '@test',
      },
      {
        key: 'com.linkedin.com',
        value: 'https://www.linkedin.com/in/test/',
      },
      {
        key: 'xyz.lensfrens',
        value: 'https://www.lensfrens.xyz/test.lens',
      },
    ],
    coins: [
      {
        id: 60,
        name: 'ETH',
        value: '0xb794f5ea0ba39494ce839613fffba74279579268',
      },
      {
        id: 0,
        name: 'BTC',
        value: '1JnJvEBykLcGHYxCZVWgDGDm7pkK3EBHwB',
      },
      {
        id: 3030,
        name: 'HBAR',
        value: '0.0.123123',
      },
      {
        id: 501,
        name: 'SOL',
        value: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
      },
    ],
    resolverAddress: '0x0' as const,
    isMigrated: true,
    createdAt: {
      date: new Date('1630553876'),
      value: 1630553876,
    },
  },
  isLoading: false,
}

vi.mock('@app/hooks/chain/useContractAddress')

vi.mock('@app/hooks/resolver/useResolverStatus')
vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/useIsWrapped')

vi.mock('@app/utils/BreakpointProvider')

vi.mock('@app/transaction-flow/TransactionFlowProvider')

vi.mock('@app/transaction/user/ProfileEditor/components/ProfileBlurb', () => ({
  ProfileBlurb: () => <div>Profile Blurb</div>,
}))

const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseResolverStatus = mockFunction(useResolverStatus)
const mockUseProfile = mockFunction(useProfile)
const mockUseIsWrapped = mockFunction(useIsWrapped)
const mockUseEnsAvatar = mockFunction(useEnsAvatar)

const mockDispatch = vi.fn()

export function setupIntersectionObserverMock({
  root = null,
  rootMargin = '',
  thresholds = [],
  disconnect = () => null,
  observe = () => null,
  takeRecords = () => [],
  unobserve = () => null,
} = {}): void {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = root

    readonly rootMargin: string = rootMargin

    readonly thresholds: ReadonlyArray<number> = thresholds

    disconnect: () => void = disconnect

    observe: (target: Element) => void = observe

    takeRecords: () => IntersectionObserverEntry[] = takeRecords

    unobserve: (target: Element) => void = unobserve
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  })

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  })
}

const makeResolverStatus = (keys?: string[], isLoading = false) => ({
  data: {
    hasResolver: false,
    hasLatestResolver: false,
    isAuthorized: false,
    hasValidResolver: false,
    hasProfile: true,
    hasMigratedProfile: false,
    isMigratedProfileEqual: false,
    isNameWrapperAware: false,
    ...(keys || []).reduce((acc, key) => {
      return {
        ...acc,
        [key]: true,
      }
    }, {}),
  },
  isLoading,
})

beforeEach(() => {
  setupIntersectionObserverMock()
})

describe('ProfileEditor', () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue(mockProfileData)
    mockUseIsWrapped.mockReturnValue({ data: false, isLoading: false })

    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    })

    window.scroll = vi.fn() as () => void

    // @ts-ignore
    mockUseContractAddress.mockReturnValue('0x0')

    mockUseResolverStatus.mockReturnValue(
      makeResolverStatus(['hasResolver', 'hasLatestResolver', 'hasValidResolver']),
    )

    mockUseEnsAvatar.mockReturnValue({
      data: 'avatar',
      isLoading: false,
    })
  })

  afterEach(() => {
    cleanup()
    vi.resetAllMocks()
  })

  it('should have use the same version of address-encoder as ensjs', () => {
    expect(appPackage.dependencies['@ensdomains/address-encoder']).toEqual(
      ensjsPackage.dependencies['@ensdomains/address-encoder'],
    )
  })

  it('should render', async () => {
    render(
      <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('profile-editor')).toBeVisible()
    })
  })
})

describe('ResolverWarningOverlay', () => {
  const makeUpdateResolverDispatch = (contract = 'registry') => ({
    name: 'setTransactions',
    payload: [
      {
        data: {
          contract,
          name: 'test.eth',
          resolverAddress: '0x123',
        },
        name: 'updateResolver',
      },
    ],
  })

  const makeMigrateProfileDispatch = (contract = 'registry') => ({
    key: 'migrate-profile-test.eth',
    name: 'startFlow',
    payload: {
      intro: {
        content: {
          data: {
            description: 'input.profileEditor.intro.migrateProfile.description',
          },
          name: 'GenericWithDescription',
        },
        title: [
          'input.profileEditor.intro.migrateProfile.title',
          {
            ns: 'transactionFlow',
          },
        ],
      },
      transactions: [
        {
          data: {
            name: 'test.eth',
          },
          name: 'migrateProfile',
        },
        {
          data: {
            contract,
            name: 'test.eth',
            resolverAddress: '0x123',
          },
          name: 'updateResolver',
        },
      ],
    },
  })

  const RESET_RESOLVER_DISPATCH = {
    key: 'reset-profile-test.eth',
    name: 'startFlow',
    payload: {
      intro: {
        content: {
          data: {
            description: 'input.profileEditor.intro.resetProfile.description',
          },
          name: 'GenericWithDescription',
        },
        title: [
          'input.profileEditor.intro.resetProfile.title',
          {
            ns: 'transactionFlow',
          },
        ],
      },
      transactions: [
        {
          data: {
            name: 'test.eth',
            resolverAddress: '0x123',
          },
          name: 'resetProfile',
        },
        {
          data: {
            contract: 'registry',
            name: 'test.eth',
            resolverAddress: '0x123',
          },
          name: 'updateResolver',
        },
      ],
    },
  }

  const MIGRATE_CURRENT_PROFILE_DISPATCH = {
    key: 'migrate-profile-with-reset-test.eth',
    name: 'startFlow',
    payload: {
      intro: {
        content: {
          data: {
            description: 'input.profileEditor.intro.migrateCurrentProfile.description',
          },
          name: 'GenericWithDescription',
        },
        title: [
          'input.profileEditor.intro.migrateCurrentProfile.title',
          {
            ns: 'transactionFlow',
          },
        ],
      },
      transactions: [
        {
          data: {
            name: 'test.eth',
            resolverAddress: '0x0',
          },
          name: 'migrateProfileWithReset',
        },
        {
          data: {
            contract: 'registry',
            name: 'test.eth',
            resolverAddress: '0x123',
          },
          name: 'updateResolver',
        },
      ],
    },
  }

  beforeEach(() => {
    mockUseProfile.mockReturnValue(mockProfileData)
    // @ts-ignore
    mockUseContractAddress.mockReturnValue('0x123')
    mockUseIsWrapped.mockReturnValue({ data: false, isLoading: false })
    mockUseEnsAvatar.mockReturnValue({
      data: 'avatar',
      isLoading: false,
    })
    mockDispatch.mockClear()
  })

  describe('No Resolver', () => {
    beforeEach(() => {
      mockUseResolverStatus.mockReturnValue(makeResolverStatus([]))
    })

    it('should dispatch update resolver', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.noResolver.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(makeUpdateResolverDispatch())
      })
    })
  })

  describe('Resolver not name wrapper aware', () => {
    beforeEach(() => {
      mockUseIsWrapped.mockReturnValue({ data: true, isLoading: false })
      mockUseResolverStatus.mockReturnValue(makeResolverStatus(['hasResolver', 'hasValidResolver']))
    })

    it('should be able to migrate profile', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverNotNameWrapperAware.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(makeMigrateProfileDispatch('nameWrapper'))
      })
    })

    it('should be able to update resolver', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverNotNameWrapperAware.title'),
        ).toBeVisible()
      })

      const switchEl = screen.getByTestId('detailed-switch')
      const toggle = within(switchEl).getByRole('checkbox')
      await userEvent.click(toggle)
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(makeUpdateResolverDispatch('nameWrapper'))
      })
    })
  })

  describe('Invalid Resolver', () => {
    beforeEach(() => {
      mockUseResolverStatus.mockReturnValue(makeResolverStatus(['hasResolver']))
    })

    it('should dispatch update resolver', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.invalidResolver.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(makeUpdateResolverDispatch())
      })
    })
  })

  describe('Resolver out of date', () => {
    beforeEach(() => {
      mockUseResolverStatus.mockReturnValue(
        makeResolverStatus(['hasResolver', 'hasValidResolver', 'isAuthorized']),
      )
    })

    it('should be able to go to profile editor', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverOutOfDate.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-skip-button'))

      await waitFor(() => {
        expect(screen.getByTestId('profile-editor')).toBeVisible()
      })
    })

    it('should be able to migrate profile and resolver', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverOutOfDate.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.transferOrResetProfile.title'),
        ).toBeVisible()
      })

      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(makeMigrateProfileDispatch())
      })
    })

    it('should be able to update resolver', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverOutOfDate.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.transferOrResetProfile.title'),
        ).toBeVisible()
      })

      const switchEl = screen.getByTestId('detailed-switch')
      const toggle = within(switchEl).getByRole('checkbox')
      await userEvent.click(toggle)

      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(makeUpdateResolverDispatch())
      })
    })
  })

  describe('Resolver out of sync ( profiles do not match )', () => {
    beforeEach(() => {
      mockUseResolverStatus.mockReturnValue(
        makeResolverStatus([
          'hasResolver',
          'hasValidResolver',
          'isAuthorized',
          'hasMigratedProfile',
        ]),
      )
    })

    it('should be able to go to profile editor', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverOutOfSync.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-skip-button'))

      await waitFor(() => {
        expect(screen.getByTestId('profile-editor')).toBeVisible()
      })
    })

    it('should be able to update resolver', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverOutOfSync.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      // Select latest profile
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.migrateProfileSelector.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('migrate-profile-selector-latest'))
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(makeUpdateResolverDispatch())
      })
    })

    it('should be able to migrate current profile', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverOutOfSync.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      // select migrate current profile
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.migrateProfileSelector.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('migrate-profile-selector-current'))
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      // migrate profile warning
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.migrateProfileWarning.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(MIGRATE_CURRENT_PROFILE_DISPATCH)
      })
    })

    it('should be able to reset profile', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverOutOfSync.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      // Select reset option
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.migrateProfileSelector.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('migrate-profile-selector-reset'))
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      // Reset profile view
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resetProfile.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(RESET_RESOLVER_DISPATCH)
      })
    })
  })

  describe('Resolver out of sync ( profiles match )', () => {
    beforeEach(() => {
      mockUseResolverStatus.mockReturnValue(
        makeResolverStatus([
          'hasResolver',
          'hasValidResolver',
          'isAuthorized',
          'hasMigratedProfile',
          'isMigratedProfileEqual',
        ]),
      )
    })

    it('should be able to go to profile editor', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverOutOfSync.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-skip-button'))

      await waitFor(() => {
        expect(screen.getByTestId('profile-editor')).toBeVisible()
      })
    })

    it('should be able to update resolver', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverOutOfSync.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      // Select latest profile
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.updateResolverOrResetProfile.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(makeUpdateResolverDispatch())
      })
    })

    it('should be able to reset profile', async () => {
      render(
        <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resolverOutOfSync.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      // Select reset option
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.updateResolverOrResetProfile.title'),
        ).toBeVisible()
      })
      const switchEl = screen.getByTestId('detailed-switch')
      const toggle = within(switchEl).getByRole('checkbox')
      await userEvent.click(toggle)
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      // Reset profile view
      await waitFor(() => {
        expect(
          screen.getByText('input.profileEditor.warningOverlay.resetProfile.title'),
        ).toBeVisible()
      })
      await userEvent.click(screen.getByTestId('warning-overlay-next-button'))

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(RESET_RESOLVER_DISPATCH)
      })
    })
  })
})
