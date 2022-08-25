import { render, screen, mockFunction } from '@app/test-utils'
import { useEthPrice } from '@app/hooks/useEthPrice'
import { CurrencyText } from './CurrencyText'

jest.mock('@app/hooks/useEthPrice')

const mockUseEthPrice = mockFunction(useEthPrice)
mockUseEthPrice.mockReturnValue({ data: 1, loading: false })

describe('CurrencyText', () => {
  it('should render correctly', async () => {
    render(<CurrencyText eth={4} currency="eth" />)
    expect(screen.getByText('4.0000 ETH')).toBeVisible()
  })

  it('should render correctly in usd mode', async () => {
    render(<CurrencyText eth={4} currency="usd" />)
    expect(screen.getByText('$4.00')).toBeVisible()
  })
})
