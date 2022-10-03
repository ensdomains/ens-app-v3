import { mockFunction, render, screen } from '@app/test-utils'

import { BigNumber } from 'ethers'

import { useEthPrice } from '@app/hooks/useEthPrice'

import { Invoice } from './Invoice'

jest.mock('@app/hooks/useEthPrice')

const mockUseEthPrice = mockFunction(useEthPrice)
mockUseEthPrice.mockReturnValue({ data: 1, loading: false })

const items = [
  {
    label: 'line 1',
    value: BigNumber.from('1000000000000000000'),
  },
  {
    label: 'line 2',
    value: BigNumber.from('2000000000000000000'),
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
