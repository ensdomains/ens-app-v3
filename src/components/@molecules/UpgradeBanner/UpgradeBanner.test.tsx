import { render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useIsLegacyFlowDisabled } from '@app/hooks/registration/useIsLegacyFlowDisabled'

import { GlobalUpgradeBanner } from './UpgradeBanner'

vi.mock('@app/hooks/registration/useIsLegacyFlowDisabled')

describe('GlobalUpgradeBanner', () => {
  it.each(['https://app.ens.domains', 'https://sepolia.app.ens.domains'])(
    'links to the network destination %s',
    (managerBaseUrl) => {
      vi.mocked(useIsLegacyFlowDisabled).mockReturnValue({
        isDisabled: true,
        isLoading: false,
        isMainnet: managerBaseUrl === 'https://app.ens.domains',
        managerBaseUrl,
      })

      render(<GlobalUpgradeBanner />)
      expect(screen.getByRole('link', { name: 'upgradeBanner.cta' })).toHaveAttribute(
        'href',
        managerBaseUrl,
      )
    },
  )
})
