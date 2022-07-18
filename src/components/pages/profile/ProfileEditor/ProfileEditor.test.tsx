import { useProfile } from '@app/hooks/useProfile'
import { mockFunction, render, screen, waitFor, within } from '@app/test-utils'
import { Profile } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
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

const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseProfile = mockFunction(useProfile)
const mockIntersectionObserver = jest.fn()
const mockSubmit = jest.fn()

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
  })

  afterEach(() => {
    cleanup()
    jest.resetAllMocks()
  })

  it('should render', async () => {
    render(
      <ProfileEditor
        open
        onDismiss={() => {}}
        name="test.eth"
        onSubmit={() => Promise.resolve()}
      />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('profile-editor')).toBeVisible()
    })
  })

  it('should call onSubmit when data is submitted', async () => {
    render(
      <ProfileEditor
        open
        onDismiss={() => {}}
        name="test.eth"
        onSubmit={mockSubmit}
      />,
    )

    const submit = await screen.findByTestId('profile-editor-submit')
    fireEvent.click(submit)
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })
  })

  it('should delete address field when delete is pressed', async () => {
    render(
      <ProfileEditor
        open
        onDismiss={() => {}}
        name="test.eth"
        onSubmit={mockSubmit}
      />,
    )

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
      expect(mockSubmit).toHaveBeenCalled()
      expect(mockSubmit.mock.calls[0][0].address.ETH).toBeUndefined()
    })
  })

  it('should replace address field when changed', async () => {
    render(
      <ProfileEditor
        open
        onDismiss={() => {}}
        name="test.eth"
        onSubmit={mockSubmit}
      />,
    )

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

    screen.getByTestId('profile-editor-submit').click()
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
      expect(mockSubmit.mock.calls[0][0].address.DOT).toBe('')
      expect(mockSubmit.mock.calls[0][0].address.BNB).toBeUndefined()
    })
  })

  it('should create address field when creating a field', async () => {
    render(
      <ProfileEditor
        open
        onDismiss={() => {}}
        name="test.eth"
        onSubmit={mockSubmit}
      />,
    )

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

    screen.getByTestId('profile-editor-submit').click()
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
      expect(mockSubmit.mock.calls[0][0].address.DOT).toBe('')
      expect(mockSubmit.mock.calls[0][0].address.BNB).toBeUndefined()
    })
  })
})
