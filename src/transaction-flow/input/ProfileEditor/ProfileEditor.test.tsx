/* eslint-disable no-await-in-loop */
import { cleanup, mockFunction, render, screen, userEvent, waitFor, within } from '@app/test-utils'

import { useNetwork } from 'wagmi'

import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useAvatar } from '@app/hooks/useAvatar'
import { useBasicName } from '@app/hooks/useBasicName'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProfile } from '@app/hooks/useProfile'
import { Profile } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import ProfileEditor from './ProfileEditor-flow'

const appPackage = require('@app/../package.json')
const ensjsPackage = require('@app/../node_modules/@ensdomains/ensjs/package.json')

const mockProfileData = {
  profile: {
    address: '0x70643CB203137b9b9eE19deA56080CD2BA01dBFd',
    records: {
      contentHash: {},
      texts: [
        {
          key: 'email',
          type: 'text',
          value: 'test@ens.domains',
        },
        {
          key: 'url',
          type: 'text',
          value: 'https://ens.domains',
        },
        {
          key: 'avatar',
          type: 'text',
          value: 'https://example.xyz/avatar/test.jpg',
        },
        {
          key: 'com.discord',
          type: 'text',
          value: 'test',
        },
        {
          key: 'com.reddit',
          type: 'text',
          value: 'https://www.reddit.com/user/test/',
        },
        {
          key: 'com.twitter',
          type: 'text',
          value: 'https://twitter.com/test',
        },
        {
          key: 'org.telegram',
          type: 'text',
          value: '@test',
        },
        {
          key: 'com.linkedin.com',
          type: 'text',
          value: 'https://www.linkedin.com/in/test/',
        },
        {
          key: 'xyz.lensfrens',
          type: 'text',
          value: 'https://www.lensfrens.xyz/test.lens',
        },
      ],
      coinTypes: [
        {
          key: '60',
          type: 'addr',
          coin: 'ETH',
          addr: '0xb794f5ea0ba39494ce839613fffba74279579268',
        },
        {
          key: '0',
          type: 'addr',
          coin: 'BTC',
          addr: '1JnJvEBykLcGHYxCZVWgDGDm7pkK3EBHwB',
        },
        {
          key: '3030',
          type: 'addr',
          coin: 'HBAR',
          addr: '0.0.123123',
        },
        {
          key: '501',
          type: 'addr',
          coin: 'SOL',
          addr: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
        },
      ],
    },
    resolverAddress: '0x0',
    isMigrated: true,
    createdAt: '1630553876',
  },
  isLoading: false,
  isWrapped: false,
}

jest.mock('@app/utils/BreakpointProvider')
jest.mock('@app/hooks/useNameDetails')
jest.mock('@app/utils/EnsProvider')
jest.mock('@app/transaction-flow/TransactionFlowProvider')
jest.mock('@app/hooks/useContractAddress')
jest.mock('@app/hooks/resolver/useResolverStatus')
jest.mock('@app/hooks/useBasicName')
jest.mock('@app/hooks/useProfile')
jest.mock('@app/utils/cacheKeyFactory')
jest.mock('@app/transaction-flow/input/ProfileEditor/components/ProfileBlurb', () => ({
  ProfileBlurb: () => <div>Profile Blurb</div>,
}))
jest.mock('@app/hooks/useAvatar')

const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseNameDetails = mockFunction(useNameDetails)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseResolverStatus = mockFunction(useResolverStatus)
const mockUseNetwork = mockFunction(useNetwork)
const mockUseBasicName = mockFunction(useBasicName)
const mockUseProfile = mockFunction(useProfile)
const mockUseQueryKeys = mockFunction(useQueryKeys)
const mockUseAvatar = mockFunction(useAvatar)

const mockDispatch = jest.fn()

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

describe('ProfileEditor', () => {
  beforeEach(() => {
    mockUseNameDetails.mockReturnValue(
      mockProfileData as unknown as { profile: Profile; loading: boolean },
    )

    mockUseNetwork.mockReturnValue({ chain: { id: 1 } })

    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    })

    setupIntersectionObserverMock()
    window.scroll = jest.fn()

    mockUseContractAddress.mockReturnValue('0x0')

    mockUseResolverStatus.mockReturnValue(
      makeResolverStatus(['hasResolver', 'hasLatestResolver', 'hasValidResolver']),
    )
    mockUseBasicName.mockReturnValue({ isWrapped: false })

    mockUseQueryKeys.mockReturnValue({
      profile: () => ['profile', 'test.eth'],
    })

    mockUseAvatar.mockReturnValue({
      avatar: 'avatar',
      isLoading: false,
    })
  })

  afterEach(() => {
    cleanup()
    jest.resetAllMocks()
  })

  it('should have use the same version of address-encoder as ensjs', () => {
    expect(appPackage.dependencies['address-encoder']).toEqual(
      ensjsPackage.dependencies['address-encoder'],
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
          resolver: '0x123',
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
            resolver: '0x123',
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
            resolver: '0x123',
          },
          name: 'resetProfile',
        },
        {
          data: {
            contract: 'registry',
            name: 'test.eth',
            resolver: '0x123',
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
            resolver: '0x123',
          },
          name: 'migrateProfileWithReset',
        },
        {
          data: {
            contract: 'registry',
            name: 'test.eth',
            resolver: '0x123',
          },
          name: 'updateResolver',
        },
      ],
    },
  }

  beforeEach(() => {
    mockUseNameDetails.mockReturnValue(
      mockProfileData as unknown as { profile: Profile; loading: boolean },
    )
    mockUseContractAddress.mockReturnValue('0x123')
    mockUseNetwork.mockReturnValue({ chain: { id: 1 } })
    mockUseBasicName.mockReturnValue({ isWrapped: false })
    mockUseProfile.mockReturnValue({
      profile: mockProfileData.profile as any,
      loading: false,
    })
    mockUseQueryKeys.mockReturnValue({
      profile: () => ['profile', 'test.eth'],
    })
    mockUseAvatar.mockReturnValue({
      avatar: 'avatar',
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
      mockUseNameDetails.mockReturnValue({ ...mockProfileData, isWrapped: true } as unknown as {
        profile: Profile
        loading: boolean
      })
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
