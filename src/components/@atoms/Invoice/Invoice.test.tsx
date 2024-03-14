import { mockFunction, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { useEthPrice } from '@app/hooks/useEthPrice'

import { Invoice } from './Invoice'

vi.mock('@app/hooks/useEthPrice')

const mockUseEthPrice = mockFunction(useEthPrice)
mockUseEthPrice.mockReturnValue({ data: BigInt(1e8), isLoading: false })

const items = [
  {
    label: 'line 1',
    value: 1000000000000000000n,
  },
  {
    label: 'line 2',
    value: 2000000000000000000n,
  },
]

describe('Invoice', () => {
  it('should render correctly in eth mode', async () => {
    render(<Invoice items={items} totalLabel="total" unit="eth" />)
    expect(screen.getByText('line 1')).toBeVisible()
    expect(screen.getByText('1.0000 ETH')).toBeVisible()
    expect(screen.getByText('line 2')).toBeVisible()
    expect(screen.getByText('2.0000 ETH')).toBeVisible()
    expect(screen.getByText('total')).toBeVisible()
    expect(screen.getByText('3.0000 ETH')).toBeVisible()
  })

  it('should render correctly in usd mode', async () => {
    render(<Invoice items={items} totalLabel="total" unit="usd" />)
    expect(screen.getByText('line 1')).toBeVisible()
    expect(screen.getByText('$1.00')).toBeVisible()
    expect(screen.getByText('line 2')).toBeVisible()
    expect(screen.getByText('$2.00')).toBeVisible()
    expect(screen.getByText('total')).toBeVisible()
    expect(screen.getByText('$3.00')).toBeVisible()
  })
})
