import { useProfile } from '@app/hooks/useProfile'
import {
  mockFunction,
  render,
  screen,
  waitFor,
  within,
  userEvent,
} from '@app/test-utils'
import { Profile } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useTransaction } from '@app/utils/TransactionProvider'
import { useEns } from '@app/utils/EnsProvider'
import { cleanup, fireEvent } from '@testing-library/react'
import { formSafeKey } from '@app/utils/editor'
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
jest.mock('@app/utils/TransactionProvider')

const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseProfile = mockFunction(useProfile)
const mockIntersectionObserver = jest.fn()
const mockUseTransaction = mockFunction(useTransaction)
const mockUseEns = mockFunction(useEns)

const mockSetRecords = jest.fn()
const mockSetCurrentTransaction = jest.fn()
const mockGetCurrentStep = jest.fn()

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

    mockUseTransaction.mockReturnValue({
      setCurrentTransaction: mockSetCurrentTransaction,
      getCurrentStep: mockGetCurrentStep,
    })

    mockUseEns.mockReturnValue({
      setRecords: mockSetRecords,
    })
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

  it('should call setRecords when data is submitted', async () => {
    render(<ProfileEditor open onDismiss={() => {}} name="test.eth" />)

    const submit = await screen.findByTestId('profile-editor-submit')
    fireEvent.click(submit)
    await waitFor(() => {
      expect(mockSetCurrentTransaction).toHaveBeenCalled()
    })
    mockSetCurrentTransaction.mock.calls[0][0].data[0].generateTx()
    await waitFor(() => {
      expect(mockSetRecords).toHaveBeenCalled()
    })
  })

  it('should replace coinType with empty string when deleted', async () => {
    render(<ProfileEditor open onDismiss={() => {}} name="test.eth" />)

    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const selectableInuput = await screen.findByTestId('selectable-input-eth')
    const deleteButton = within(selectableInuput).getByTestId(
      'selectable-input-delete',
    )
    fireEvent.click(deleteButton)
    await waitFor(() => {
      expect(selectableInuput).not.toBeVisible()
    })

    screen.getByTestId('profile-editor-submit').click()
    await waitFor(() => {
      expect(mockSetCurrentTransaction).toHaveBeenCalled()
    })
    mockSetCurrentTransaction.mock.calls[0][0].data[0].generateTx()
    await waitFor(() => {
      expect(mockSetRecords).toHaveBeenCalled()
    })
    expect(
      mockSetRecords.mock.calls[0][1].records.coinTypes.find(
        (record: any) => record.key === 'ETH',
      ).value,
    ).toBe('')
    expect(mockSetRecords.mock.calls[0][1].records.coinTypes.length).toBe(1)
  })

  it('should', async () => {
    render(<ProfileEditor open onDismiss={() => {}} name="test.eth" />)

    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const addButton = await screen.findByTestId('add-address-button')
    fireEvent.click(addButton)

    const select = await screen.findByTestId('select-container')

    fireEvent.click(select)

    const listbox = await screen.findByRole('listbox')
    const option = await within(listbox).findByText('DOT')
    fireEvent.click(option)

    await waitFor(() => {
      expect(screen.getByTestId('selectable-input-dot')).toBeVisible()
    })

    await userEvent.type(
      screen.getByTestId('selectable-input-dot-input'),
      '0x123',
    )

    screen.getByTestId('profile-editor-submit').click()
    await waitFor(() => {
      expect(mockSetCurrentTransaction).toHaveBeenCalled()
    })
    mockSetCurrentTransaction.mock.calls[0][0].data[0].generateTx()

    await waitFor(() => {
      expect(mockSetRecords).toHaveBeenCalled()
    })
    expect(
      mockSetRecords.mock.calls[0][1].records.coinTypes.find(
        (record: any) => record.key === 'DOT',
      ).value,
    ).toBe('0x123')
    expect(mockSetRecords.mock.calls[0][1].records.coinTypes.length).toBe(1)
  })

  it('should create address field when creating a field', async () => {
    render(<ProfileEditor open onDismiss={() => {}} name="test.eth" />)

    const tab = await screen.findByTestId('other-tab')
    fireEvent.click(tab)

    const addButton = await screen.findByTestId('add-other-button')
    fireEvent.click(addButton)

    const select = await screen.findByTestId('select-container')
    fireEvent.click(select)

    await userEvent.type(screen.getByTestId('select-input'), 'test.key')

    const listbox = await screen.findByRole('listbox')
    const option = await within(listbox).findByRole('option')
    fireEvent.click(option)

    await waitFor(() => {
      expect(
        screen.getByTestId(formSafeKey('selectable-input-test.key')),
      ).toBeVisible()
    })

    await userEvent.type(
      screen.getByTestId(formSafeKey('selectable-input-test.key-input')),
      '0x123',
    )
    screen.getByTestId('profile-editor-submit').click()
    await waitFor(() => {
      expect(mockSetCurrentTransaction).toHaveBeenCalled()
    })
    mockSetCurrentTransaction.mock.calls[0][0].data[0].generateTx()
    await waitFor(() => {
      expect(mockSetRecords).toHaveBeenCalled()
      console.log(mockSetRecords.mock.calls[0][1].records.texts)
      expect(
        mockSetRecords.mock.calls[0][1].records.texts.find(
          (record: any) => record.key === 'test.key',
        )?.value,
      ).toBe('0x123')
      expect(mockSetRecords.mock.calls[0][1].records.texts.length).toBe(1)
    })
  })
})
