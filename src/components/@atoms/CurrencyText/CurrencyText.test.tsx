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
})
