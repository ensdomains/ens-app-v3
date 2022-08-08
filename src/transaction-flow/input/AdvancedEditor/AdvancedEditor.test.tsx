import { useProfile } from '@app/hooks/useProfile'
import {
  cleanup,
  fireEvent,
  mockFunction,
  render,
  screen,
  waitFor,
  within,
  userEvent,
} from '@app/test-utils'
import { Profile } from '@app/types'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import AdvancedEditor from './AdvancedEditor'

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

jest.mock('@app/utils/EnsProvider')
jest.mock('@app/hooks/useProfile')
jest.mock('@app/transaction-flow/TransactionFlowProvider')
jest.mock('@app/hooks/useResolverHasInterfaces')

const mockUseProfile = mockFunction(useProfile)
const mockUseResolverHasInterfaces = mockFunction(useResolverHasInterfaces)

const mockIntersectionObserver = jest.fn()

const mockDispatch = jest.fn()

describe('AdvancedEditor', () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue(
      mockProfileData as unknown as { profile: Profile; loading: boolean },
    )

    mockUseResolverHasInterfaces.mockReturnValue({
      hasInterface: true,
      isLoading: false,
      status: 'success',
    })

    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    })
    window.IntersectionObserver = mockIntersectionObserver
    window.scroll = jest.fn()
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('advanced-editor')).toBeVisible()
    })
  })

  it('should submit key with empty string in an existing text record is deleted', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )

    const avatarInput = await screen.findByTestId('record-input-avatar')
    const deleteBtn = within(avatarInput).getByTestId('record-input-delete')
    fireEvent.click(deleteBtn)

    const submitBtn = screen.getByText('action.save')
    await waitFor(() => {
      expect(submitBtn).not.toHaveAttribute('disabled')
    })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.texts[0]).toEqual({
      key: 'avatar',
      value: '',
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.texts.length).toBe(1)
  })

  it('should submit key/value when new text is added', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )
    const addButton = await screen.findByTestId('add-record-button')
    const addInput = within(addButton).getByTestId('add-record-button-input')
    await userEvent.type(addInput, 'testKey')
    const addRecordBtn = await within(addButton).findByText('action.add')
    await userEvent.click(addRecordBtn)

    const newInput = await screen.findByTestId('record-input-testKey')
    await userEvent.type(within(newInput).getByTestId('record-input-input'), 'testValue')

    const submitBtn = screen.getByText('action.save')
    await waitFor(() => {
      expect(submitBtn).not.toHaveAttribute('disabled')
    })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.texts[0]).toEqual({
      key: 'testKey',
      value: 'testValue',
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.texts.length).toBe(1)
  })

  it('should submit key with empty string in an existing address record is deleted', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )
    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const adressInput = await screen.findByTestId('record-input-ETH')
    const deleteBtn = within(adressInput).getByTestId('record-input-delete')
    fireEvent.click(deleteBtn)

    const submitBtn = screen.getByText('action.save')
    await waitFor(() => {
      expect(submitBtn).not.toHaveAttribute('disabled')
    })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.coinTypes[0]).toEqual({
      key: 'ETH',
      value: '',
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.coinTypes.length).toBe(1)
  })

  it('should submit key/value when new address is added', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )

    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const addButton = await screen.findByTestId('add-record-button')
    await userEvent.click(addButton)
    const addOption = await screen.findByTestId('add-record-button-option-DOT')
    await userEvent.click(addOption)

    const newInput = await screen.findByTestId('record-input-DOT')
    await userEvent.type(
      within(newInput).getByTestId('record-input-input'),
      '5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX',
    )

    const submitBtn = screen.getByText('action.save')
    await waitFor(() => {
      expect(submitBtn).not.toHaveAttribute('disabled')
    })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.coinTypes[0]).toEqual({
      key: 'DOT',
      value: '5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX',
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.coinTypes.length).toBe(1)
  })
})
