import { useProfile } from '@app/hooks/useProfile'
import {
  mockFunction,
  render,
  screen,
  waitFor,
  within,
  userEvent,
  cleanup,
  fireEvent,
} from '@app/test-utils'
import { Profile } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { usePublicResolverAddress } from '@app/hooks/usePublicResolverAddress'
import { useResolverStatus } from '@app/hooks/useResolverStatus'
import ProfileEditor from './ProfileEditor'

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
          key: 'com.github',
          type: 'text',
          value: 'https://github.com/test',
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
jest.mock('@app/hooks/usePublicResolverAddress')
jest.mock('@app/hooks/useResolverStatus')

const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseProfile = mockFunction(useProfile)
const mockUsePublicResolverAddress = mockFunction(usePublicResolverAddress)
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

    mockUsePublicResolverAddress.mockReturnValue({
      address: '0x0',
      loading: false,
    })

    mockUseResolverStatus.mockReturnValue({
      status: {
        hasLatestResolver: true,
        hasCreatedProfile: true,
        hasMigratedProfile: true,
      },
      loading: false,
    })
  })

  afterEach(() => {
    cleanup()
    jest.resetAllMocks()
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
        value: '',
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
})

describe('ProfileEditor with old resolver', () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue(
      mockProfileData as unknown as { profile: Profile; loading: boolean },
    )

    mockUsePublicResolverAddress.mockReturnValue({
      address: '0x123',
      loading: false,
    })

    mockUseResolverStatus.mockReturnValue({
      status: {
        hasLatestResolver: false,
        hasCreatedProfile: true,
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
