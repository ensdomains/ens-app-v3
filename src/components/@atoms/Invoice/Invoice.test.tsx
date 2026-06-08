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

  // Regression: SNRC's `.testing` registration price is 0n. The original
  // `loading={!value}` Skeleton + `filter(!!x)` collapsed 0n to "still
  // loading", which left the row in a permanent shimmer.
  //
  // jsdom does not apply thorin's vanilla-extract CSS, so `toBeVisible()`
  // can't distinguish skeleton-on from skeleton-off. We detect the actual
  // skeleton state via thorin's "krcy0m1" animation class which is only
  // added to the wrapper when `loading={true}`.
  const skeletonOf = (testId: string) => {
    const inner = document.querySelector(`[data-testid="${testId}"]`)
    const ancestorAnim = inner?.closest('.krcy0m1') !== null
    const descendantAnim = !!inner?.querySelector('.krcy0m1')
    return ancestorAnim || descendantAnim
  }

  it('treats a 0n line value as a real free price, not as loading', () => {
    const freeAndPaid = [
      { label: 'free row', value: 0n },
      { label: 'paid row', value: 1000000000000000000n },
    ]
    render(<Invoice items={freeAndPaid} totalLabel="total" unit="eth" />)
    // Neither row may be in a skeleton, nor the total. The 0n row would
    // light up the skeleton on the pre-fix code path.
    expect(skeletonOf('invoice-item-0-amount')).toBe(false)
    expect(skeletonOf('invoice-item-1-amount')).toBe(false)
    expect(skeletonOf('invoice-total')).toBe(false)
    // 0n + 1 ETH = 1 ETH in the total. If the 0n row had been treated as
    // loading it would have been filtered out of the sum.
    expect(screen.getAllByText('1.0000 ETH')).toHaveLength(2)
  })

  // Regression: `undefined` is what FullInvoice now passes while a sibling
  // estimate (price/gas) is in flight. The skeleton must still kick in for
  // genuinely-unset values; only 0n is treated as a real value.
  it('puts undefined-value rows AND the total in skeleton state', () => {
    const partial = [
      { label: 'resolved row', value: 1000000000000000000n },
      { label: 'pending row', value: undefined },
    ]
    render(<Invoice items={partial} totalLabel="total" unit="eth" />)
    expect(skeletonOf('invoice-item-0-amount')).toBe(false)
    expect(skeletonOf('invoice-item-1-amount')).toBe(true)
    // Total is incomplete while any item is pending → skeleton on.
    expect(skeletonOf('invoice-total')).toBe(true)
  })
})
