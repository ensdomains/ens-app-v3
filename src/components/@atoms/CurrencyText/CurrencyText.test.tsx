import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useEthPrice } from '@app/hooks/useEthPrice'

import { CurrencyText } from './CurrencyText'

vi.mock('@app/hooks/useEthPrice')

const mockUseEthPrice = mockFunction(useEthPrice)
mockUseEthPrice.mockReturnValue({ data: BigInt(1e8), isLoading: false })

describe('CurrencyText', () => {
  it('should render correctly', async () => {
    render(<CurrencyText eth={4000000000000000000n} currency="eth" />)
    expect(screen.getByText('4.0000 ETH')).toBeVisible()
  })

  it('should append extra decimal to usd if it does not exist', async () => {
    render(<CurrencyText eth={4000000000000000000n} currency="usd" />)
    expect(screen.getByText('$4.00')).toBeVisible()
  })

  it('should cut off at ETH at 4 decimals', async () => {
    render(<CurrencyText eth={4444444444444444444n} currency="eth" />)
    expect(screen.getByText('4.4444 ETH')).toBeVisible()
  })

  // Regression: SNRC's `.testing` registrations are free (price=0n). The
  // original `loading={isEthPriceLoading || !eth || !ethPrice}` treated 0n
  // as "still loading" because `!0n` is true — the skeleton never cleared.
  it('renders a free (0n) value as "0 ETH", not as a permanent skeleton', () => {
    render(<CurrencyText eth={0n} currency="eth" />)
    expect(screen.getByText('0 ETH')).toBeVisible()
  })

  // Regression: when toggling to fiat, `makeCurrencyDisplay`'s `if (!eth ||
  // !ethPrice) return '0.0000 ETH'` short-circuited to the hardcoded ETH
  // string for 0n values. USD users saw "0.0000 ETH" instead of "$0.00".
  it('renders a free (0n) value as "$0.00" in usd mode, not as "0.0000 ETH"', () => {
    render(<CurrencyText eth={0n} currency="usd" />)
    expect(screen.getByText('$0.00')).toBeVisible()
    expect(screen.queryByText('0.0000 ETH')).toBeNull()
  })
})
