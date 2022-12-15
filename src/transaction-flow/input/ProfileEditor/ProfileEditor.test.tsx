/* eslint-disable no-await-in-loop */
import {
  cleanup,
  fireEvent,
  mockFunction,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@app/test-utils'

import { useContractAddress } from '@app/hooks/useContractAddress'
import { useProfile } from '@app/hooks/useProfile'
import { useResolverStatus } from '@app/hooks/useResolverStatus'
import { Profile } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

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
          value: 'test#1234',
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
  loading: false,
}

jest.mock('@app/utils/BreakpointProvider')
jest.mock('@app/hooks/useProfile')
jest.mock('@app/utils/EnsProvider')
jest.mock('@app/transaction-flow/TransactionFlowProvider')
jest.mock('@app/hooks/useContractAddress')
jest.mock('@app/hooks/useResolverStatus')

const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseProfile = mockFunction(useProfile)
const mockUseContractAddress = mockFunction(useContractAddress)
const mockUseResolverStatus = mockFunction(useResolverStatus)

const mockSetCurrentTransaction = jest.fn()
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

describe('ProfileEditor', () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue(
      mockProfileData as unknown as { profile: Profile; loading: boolean },
    )

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

    mockUseResolverStatus.mockReturnValue({
      status: {
        hasResolver: true,
        hasLatestResolver: true,
        isMigratedProfileEqual: true,
        hasMigratedProfile: true,
      },
      loading: false,
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

  it('should submit empty string when an existing record is deleted', async () => {
    render(
      <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
    )

    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const recordInput = await screen.findByTestId('record-input-ETH')
    const deleteButton = within(recordInput).getByTestId('record-input-delete')
    fireEvent.click(deleteButton)
    await waitFor(() => {
      expect(recordInput).not.toBeVisible()
    })

    const submitButton = screen.getByTestId('profile-editor-submit')
    await waitFor(() => {
      expect(submitButton).not.toHaveAttribute('disabled')
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockDispatch.mock.calls[0][0].payload[0].data.records.coinTypes[0]).toEqual({
        key: 'ETH',
        value: '0x0000000000000000000000000000000000000000',
      })
    })
  })

  it('should submit a key and value when a new record is created', async () => {
    render(
      <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
    )

    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const addButton = await screen.findByTestId('add-record-button')
    fireEvent.click(addButton)

    const select = await screen.findByTestId('add-record-button-option-DOT')
    fireEvent.click(select)

    const recordInput = await screen.findByTestId('record-input-DOT')
    const recordInputInput = within(recordInput).getByTestId('record-input-input')

    await userEvent.type(recordInputInput, '5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX')

    const submitButton = screen.getByTestId('profile-editor-submit')
    await waitFor(() => {
      expect(submitButton).not.toHaveAttribute('disabled')
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockDispatch.mock.calls[0][0].payload[0].data.records.coinTypes[0]).toEqual({
        key: 'DOT',
        value: '5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX',
      })
    })
  })

  it('should prevent a custom record key if it already exists', async () => {
    render(
      <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
    )

    const tab = await screen.findByTestId('other-tab')
    fireEvent.click(tab)

    const addButton = await screen.findByTestId('add-record-button')
    fireEvent.click(addButton)

    const input = await screen.findByTestId('add-record-button-input')
    await userEvent.type(input, 'description')

    const actionBtn = await screen.findByTestId('add-record-button-action-button')
    expect(actionBtn).toHaveAttribute('disabled')
    expect(actionBtn).toHaveTextContent('action.add')
    expect(screen.getByText('errors.keyInUse.description')).toBeInTheDocument()
  })

  it('should set submit button to disabled if new record is created an then deleted', async () => {
    render(
      <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
    )

    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const addButton = await screen.findByTestId('add-record-button')
    fireEvent.click(addButton)

    const select = await screen.findByTestId('add-record-button-option-DOT')
    fireEvent.click(select)

    const recordInput = await screen.findByTestId('record-input-DOT')
    const recordInputInput = within(recordInput).getByTestId('record-input-input')

    await userEvent.type(recordInputInput, '5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX')

    const deleteRecord = within(recordInput).getByTestId('record-input-delete')
    fireEvent.click(deleteRecord)

    const submitButton = screen.getByTestId('profile-editor-submit')
    await waitFor(() => {
      expect(submitButton).toHaveAttribute('disabled')
    })
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(mockSetCurrentTransaction).not.toHaveBeenCalled()
    })
  })

  it('should overwrite existing records and add new records for records passed in transactions', async () => {
    render(
      <ProfileEditor
        data={{ name: 'test.eth' }}
        transactions={[
          {
            name: 'updateProfile',
            data: {
              records: {
                texts: [
                  {
                    key: 'com.twitter',
                    value: 'test2',
                  },
                  {
                    key: 'com.github',
                    value: 'test2',
                  },
                  {
                    key: 'other',
                    value: 'test2',
                  },
                  {
                    key: 'email',
                    value: 'test@ens.domains',
                  },
                ],
                coinTypes: [
                  {
                    key: 'BNB',
                    value: 'bnb1g5p04snezgpky203fq6da9qyjsy2k9kzr5yuhl',
                  },
                  {
                    key: 'ETH',
                    value: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
                  },
                ],
                contentHash: 'https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu',
              },
            },
          },
        ]}
        dispatch={mockDispatch}
        onDismiss={() => {}}
      />,
    )

    const tabs = [
      {
        tab: 'accounts-tab',
        records: [
          {
            label: 'Twitter',
            value: 'test2',
          },
          {
            label: 'GitHub',
            value: 'test2',
          },
        ],
      },
      {
        tab: 'address-tab',
        records: [
          {
            label: 'BNB',
            value: 'bnb1g5p04snezgpky203fq6da9qyjsy2k9kzr5yuhl',
          },
          {
            label: 'ETH',
            value: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          },
        ],
      },
      {
        tab: 'website-tab',
        records: [
          {
            label: 'IPFS',
            value: 'https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu',
          },
        ],
      },
      {
        tab: 'other-tab',
        records: [
          {
            label: 'other',
            value: 'test2',
          },
          {
            label: 'email',
            value: 'test@ens.domains',
          },
        ],
      },
    ]

    for (const { tab, records } of tabs) {
      const tabEl = await screen.findByTestId(tab)
      await userEvent.click(tabEl)

      for (const { label, value } of records) {
        const record = await screen.findByTestId(`record-input-${label}`)
        const recordInput = await within(record).getByTestId('record-input-input')
        expect(recordInput).toHaveValue(value)
      }
    }
  })
})

describe('ProfileEditor with old resolver', () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue(
      mockProfileData as unknown as { profile: Profile; loading: boolean },
    )

    mockUseContractAddress.mockReturnValue('0x123')

    mockUseResolverStatus.mockReturnValue({
      status: {
        hasResolver: true,
        hasLatestResolver: false,
        isMigratedProfileEqual: true,
        hasMigratedProfile: true,
      },
      loading: false,
    })
  })

  it('should submit to key value to alternative dispatch if resolver address is not current', async () => {
    render(
      <ProfileEditor data={{ name: 'test.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
    )

    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const addButton = await screen.findByTestId('add-record-button')
    fireEvent.click(addButton)

    const select = await screen.findByTestId('add-record-button-option-DOT')
    fireEvent.click(select)

    const recordInput = await screen.findByTestId('record-input-DOT')
    const recordInputInput = within(recordInput).getByTestId('record-input-input')

    await userEvent.type(recordInputInput, '5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX')

    const submitButton = screen.getByTestId('profile-editor-submit')
    await waitFor(() => {
      expect(submitButton).not.toHaveAttribute('disabled')
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockDispatch.mock.calls[0][0].name).toBe('startFlow')
      expect(
        mockDispatch.mock.calls[0][0].payload.transactions[0].data.records.coinTypes[0],
      ).toEqual({
        key: 'DOT',
        value: '5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX',
      })
    })
  })
})
