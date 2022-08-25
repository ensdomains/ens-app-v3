import { render, screen, waitFor } from '@app/test-utils'
import userEvent from '@testing-library/user-event'
import { CurrencySwitch } from './CurrencySwitch'

const mockChangeHandler = jest.fn()

const getSwitchSate = () => {
  return getComputedStyle(screen.getByTestId('currency-switch')).left === '50%' ? 'USD' : 'ETH'
}

describe('CurrencySwitch', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders correctly', async () => {
    render(<CurrencySwitch />)
    expect(screen.getByText('ETH')).toBeVisible()
    expect(screen.getByText('USD')).toBeVisible()
    await waitFor(() => {
      expect(getSwitchSate()).toBe('ETH')
    })
  })

  it('should be set to value of value', async () => {
    render(<CurrencySwitch value="usd" />)
    await waitFor(() => {
      expect(getSwitchSate()).toBe('USD')
    })
  })

  it('should call onChange when clicked', async () => {
    render(<CurrencySwitch value="usd" onChange={mockChangeHandler} />)
    await userEvent.click(screen.getByTestId('currency-switch'))
    await waitFor(() => {
      expect(mockChangeHandler).toBeCalledWith('eth')
    })
  })
})
