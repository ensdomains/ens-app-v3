import { useProfile } from '@app/hooks/useProfile'
import { mockFunction, render, screen, waitFor } from '@app/test-utils'
import { Profile } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { cleanup } from '@testing-library/react'
import ProfileEditor from './ProfileEditor'

const mockProfileData = {
  profile: {
    address: '0x9eddfE3A95AA77E4F6509927De67BB1EaAE3b382',
    records: {
      contentHash: {},
      texts: [
        {
          key: 'email',
          type: 'text',
          value: 'khori@ens.domains',
        },
        {
          key: 'url',
          type: 'text',
          value: 'https://ens.domains',
        },
        {
          key: 'avatar',
          type: 'text',
          value:
            'eip155:1/erc721:0x93b40000888755AF12Be659D7337E2b592D205D9/878',
        },
        {
          key: 'com.discord',
          type: 'text',
          value: 'khori.eth#8064',
        },
        {
          key: 'com.github',
          type: 'text',
          value: 'https://github.com/khori-eth',
        },
        {
          key: 'com.reddit',
          type: 'text',
          value: 'https://www.reddit.com/user/thebashabasha/',
        },
        {
          key: 'com.twitter',
          type: 'text',
          value: 'https://twitter.com/KhoriWhittaker',
        },
        {
          key: 'org.telegram',
          type: 'text',
          value: '@KhoriWhittaker',
        },
        {
          key: 'com.linkedin.com',
          type: 'text',
          value: 'https://www.linkedin.com/in/khoriwhittaker/',
        },
        {
          key: 'xyz.lensfrens',
          type: 'text',
          value: 'https://www.lensfrens.xyz/khori.lens',
        },
      ],
      coinTypes: [
        {
          key: '60',
          type: 'addr',
          coin: 'ETH',
          addr: '0x9eddfE3A95AA77E4F6509927De67BB1EaAE3b382',
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
          addr: '0.0.281383',
        },
        {
          key: '148',
          type: 'addr',
          coin: 'XLM',
          addr: 'GDBE75BSTZ7YQUPWUL4TWSBPBGJXZJC7YWAUW4OE6KAAWFYDASA42UC7',
        },
        {
          key: '144',
          type: 'addr',
          coin: 'XRP',
          addr: 'rMxZtU3UNyps94TgWcd1zyiwsfkFy9DTFM',
        },
        {
          key: '501',
          type: 'addr',
          coin: 'SOL',
          addr: '63ghQsrGD6P78yaHGY7YGcyAjPLCfCCqXBmCTQxCX5SU',
        },
        {
          key: '2147483785',
          type: 'addr',
          coin: 'MATIC',
          addr: '0x9eddfE3A95AA77E4F6509927De67BB1EaAE3b382',
        },
      ],
    },
    resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    isMigrated: true,
    createdAt: '1630553876',
  },
  loading: false,
}

jest.mock('@app/utils/BreakpointProvider')
const mockUseBreakpoint = mockFunction(useBreakpoint)
mockUseBreakpoint.mockReturnValue({
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,
})

jest.mock('@app/hooks/useProfile')
const mockUseProfile = mockFunction(useProfile)

// const mockSubmit = jest.fn()

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
  })

  afterEach(() => {
    cleanup()
  })

  it('should render', async () => {
    render(
      <ProfileEditor
        open
        onDismiss={() => {}}
        name="khori.eth"
        onSubmit={() => Promise.resolve()}
      />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('profile-editor')).toBeVisible()
    })
  })

  it('should render profile data', async () => {
    render(
      <ProfileEditor
        open
        onDismiss={() => {}}
        name="khori.eth"
        onSubmit={() => Promise.resolve()}
      />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('profile-editor')).toBeVisible()
    })

    await waitFor(() => {
      expect(
        screen.getByTestId('tab-container')?.children.length,
      ).toBeGreaterThan(0)
    })
    const accountsTab = screen.getByTestId('tab-container')
    console.log('accounts', accountsTab.children.length)
  })

  it('should return some data', async () => {
    const mockSubmit = jest.fn()
    render(
      <ProfileEditor
        open
        onDismiss={() => {}}
        name="khori.eth"
        onSubmit={mockSubmit}
      />,
    )

    await waitFor(() => {
      console.log('waiting for profile to load')
      expect(screen.getByTestId('profile-editor')).toBeVisible()
    })

    screen.getByTestId('profile-editor-submit').click()
    console.log('>>>', mockSubmit.mock.calls)
  })
})
