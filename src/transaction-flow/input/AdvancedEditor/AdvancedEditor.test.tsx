import { useProfile } from '@app/hooks/useProfile'
import { cleanup, mockFunction, render, screen, waitFor } from '@app/test-utils'
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
})
