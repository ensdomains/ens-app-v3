import { fireEvent, render, screen, userEvent } from '@app/test-utils'

import mockRouter from 'next-router-mock'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Home from '@app/pages/index'
import { trackEvent } from '@app/utils/analytics'

import { Basic } from './Basic'

const state = vi.hoisted(() => ({
  controllerActive: true as boolean | undefined,
  consent: 'yes' as 'yes' | 'no' | 'undecided',
}))

vi.mock('next/router', async () => vi.importActual('next-router-mock'))
vi.mock('wagmi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('wagmi')>()),
  useAccount: () => ({ isConnected: false }),
  useSwitchChain: () => ({ switchChain: vi.fn() }),
}))
vi.mock('@app/hooks/useSetupIntercom', () => ({ useSetupIntercom: vi.fn() }))
vi.mock('@app/hooks/registration/useIsEthRegistrarControllerActive', () => ({
  useIsEthRegistrarControllerActive: () => ({ data: state.controllerActive }),
}))
vi.mock('@app/hooks/registration/useIsLegacyFlowDisabled', () => ({
  useIsLegacyFlowDisabled: () => ({
    isDisabled: state.controllerActive === false,
    isLoading: false,
    isMainnet: false,
    managerBaseUrl: 'https://app.ens.dev',
  }),
}))
vi.mock('@app/utils/analytics/cookies', () => ({
  useCookieConsent: () => ({ consent: state.consent }),
}))
vi.mock('@app/utils/analytics', () => ({ trackEvent: vi.fn() }))
vi.mock('@app/hooks/chain/useChainName', () => ({ useChainName: () => 'mainnet' }))
vi.mock('./Navigation', () => ({ Navigation: () => <nav /> }))
vi.mock('@app/components/@molecules/FaucetBanner', () => ({ default: () => null }))
vi.mock('@app/components/@molecules/Hamburger/Hamburger', () => ({ default: () => null }))
vi.mock('@app/components/@molecules/SearchInput/SearchInput', () => ({
  SearchInput: () => <input aria-label="Search names" />,
}))

describe('Basic ENSv2 announcement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    state.controllerActive = true
    state.consent = 'yes'
    mockRouter.setCurrentUrl('/')
  })

  it.each([
    ['/', 'home'],
    ['/my/names?sort=expiry', 'my_names'],
  ])('shows the banner on %s and attributes clicks to %s', (route, placement) => {
    mockRouter.setCurrentUrl(route)
    render(<Basic>Page content</Basic>)
    expect(screen.getByText('banner.title')).toBeVisible()
    expect(screen.getByText('banner.caption')).toBeVisible()
    const link = screen.getByRole('link', { name: 'banner.cta' })
    expect(link).toHaveAttribute(
      'href',
      'https://support.ens.domains/en/articles/15122781-what-s-changing-with-ensv2-pricing-discounts-and-grace-period',
    )
    expect(trackEvent).not.toHaveBeenCalled()
    fireEvent.click(link)
    expect(trackEvent).toHaveBeenCalledExactlyOnceWith('ensv2:banner_click', 'mainnet', {
      placement,
    })
  })

  it.each(['/profile/test.eth', '/my/settings', '/register/test.eth'])(
    'does not show the banner on %s',
    (route) => {
      mockRouter.setCurrentUrl(route)
      render(<Basic>Page content</Basic>)
      expect(screen.queryByTestId('ensv2-announcement')).not.toBeInTheDocument()
      expect(trackEvent).not.toHaveBeenCalled()
    },
  )

  it('renders only one announcement on the homepage', () => {
    render(
      <Basic>
        <Home />
      </Basic>,
    )
    expect(screen.getAllByTestId('ensv2-announcement')).toHaveLength(1)
    expect(screen.queryByText('legacyAppBanner.title')).not.toBeInTheDocument()
  })

  it.each(['/', '/my/names'])(
    'hides the announcement when the controller is disabled on %s',
    (route) => {
      state.controllerActive = false
      mockRouter.setCurrentUrl(route)
      render(
        <Basic>
          <Home />
        </Basic>,
      )
      expect(screen.queryByTestId('ensv2-announcement')).not.toBeInTheDocument()
      expect(screen.getByText('legacyAppBanner.title')).toBeVisible()
      expect(trackEvent).not.toHaveBeenCalled()
    },
  )

  it('preserves the initial announcement while controller status is loading', () => {
    state.controllerActive = undefined
    render(<Basic>Page content</Basic>)
    expect(screen.getByTestId('ensv2-announcement')).toBeVisible()
  })

  it.each(['no', 'undecided'] as const)('does not track clicks with %s consent', (consent) => {
    state.consent = consent
    render(<Basic>Page content</Basic>)
    fireEvent.click(screen.getByRole('link', { name: 'banner.cta' }))
    expect(trackEvent).not.toHaveBeenCalled()
  })

  it('has one keyboard-focusable CTA and supports Enter activation', async () => {
    render(<Basic>Page content</Basic>)
    const link = screen.getByRole('link', { name: 'banner.cta' })
    await userEvent.tab()
    expect(link).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(trackEvent).toHaveBeenCalledExactlyOnceWith('ensv2:banner_click', 'mainnet', {
      placement: 'home',
    })
  })
})
