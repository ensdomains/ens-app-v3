import { useProfile } from '@app/hooks/useProfile'
import { mockFunction, render, screen, waitFor, within, userEvent } from '@app/test-utils'
import { Profile } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { useEns } from '@app/utils/EnsProvider'
import { cleanup, fireEvent } from '@testing-library/react'
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
          addr: '0x70643CB203137b9b9eE19deA56080CD2BA01dBFd',
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
          key: '148',
          type: 'addr',
          coin: 'XLM',
          addr: 'testxmladdress',
        },
        {
          key: '144',
          type: 'addr',
          coin: 'XRP',
          addr: 'testxrpaddress',
        },
        {
          key: '501',
          type: 'addr',
          coin: 'SOL',
          addr: 'testsoladdress',
        },
        {
          key: '2147483785',
          type: 'addr',
          coin: 'MATIC',
          addr: '0x70643CB203137b9b9eE19deA56080CD2BA01dBFd',
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

const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseProfile = mockFunction(useProfile)
const mockIntersectionObserver = jest.fn()
const mockUseTransactionFlow = mockFunction(useTransactionFlow)
const mockUseEns = mockFunction(useEns)

const mockSetRecords = jest.fn()
const mockSetCurrentTransaction = jest.fn()

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

    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    })
    window.IntersectionObserver = mockIntersectionObserver
    window.scroll = jest.fn()

    mockUseEns.mockReturnValue({
      setRecords: mockSetRecords,
    })

    mockUseTransactionFlow.mockReturnValue('test')
  })

  afterEach(() => {
    cleanup()
    jest.resetAllMocks()
  })

  it('should render', async () => {
    render(<ProfileEditor open onDismiss={() => {}} name="test.eth" />)
    await waitFor(() => {
      expect(screen.getByTestId('profile-editor')).toBeVisible()
    })
  })

  it('should submit empty string when an existing record is deleted', async () => {
    render(<ProfileEditor open onDismiss={() => {}} name="test.eth" />)

    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const recordInput = await screen.findByTestId('record-input-ETH')
    const deleteButton = within(recordInput).getByTestId('record-input-delete')
    fireEvent.click(deleteButton)
    await waitFor(() => {
      expect(recordInput).not.toBeVisible()
    })

    screen.getByTestId('profile-editor-submit').click()
  })

  it('should submit a key and value when a new record is created', async () => {
    render(<ProfileEditor open onDismiss={() => {}} name="test.eth" />)

    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const addButton = await screen.findByTestId('add-record-button')
    fireEvent.click(addButton)

    const select = await screen.findByTestId('add-record-button-option-DOT')
    fireEvent.click(select)

    const recordInput = await screen.findByTestId('record-input-DOT')
    const recordInputInput = within(recordInput).getByTestId('record-input-input')

    await userEvent.type(recordInputInput, '5F3sa2TJAWMqDhXG6jhV4N8ko9SxwGy8TpaNS1repo5EYjQX')
  })

  it('should set submit button to disabled if new record is created an then deleted', async () => {
    render(<ProfileEditor open onDismiss={() => {}} name="test.eth" />)

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
