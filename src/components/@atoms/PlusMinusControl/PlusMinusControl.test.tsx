import { render, screen, userEvent, waitFor } from '@app/test-utils'
import { PlusMinusControl } from './PlusMinusControl'

const mockChangeHandler = jest.fn()

describe('PlusMinusControl', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', async () => {
    render(<PlusMinusControl value={2} />)
    expect(screen.getByTestId('plus-minus-control-plus')).toBeVisible()
    expect(screen.getByTestId('plus-minus-control-minus')).toBeVisible()
    expect(screen.getByText('2 years')).toBeVisible()
  })

  it('should call onChange when value is incremented', async () => {
    render(<PlusMinusControl value={2} onChange={mockChangeHandler} />)
    await userEvent.click(screen.getByTestId('plus-minus-control-plus'))
    await waitFor(() => {
      expect(mockChangeHandler.mock.calls[0][0].target.value).toEqual('3')
    })
  })

  it('should call onChange when value is decremented', async () => {
    render(<PlusMinusControl value={2} onChange={mockChangeHandler} />)
    await userEvent.click(screen.getByTestId('plus-minus-control-minus'))
    await waitFor(() => {
      expect(mockChangeHandler.mock.calls[0][0].target.value).toEqual('1')
    })
  })

  it('should not call onChange if value is at minValue', async () => {
    render(<PlusMinusControl value={2} minValue={2} onChange={mockChangeHandler} />)
    await userEvent.click(screen.getByTestId('plus-minus-control-minus'))
    await waitFor(() => {
      expect(mockChangeHandler).not.toBeCalled()
    })
  })

  it('should render correctly', async () => {
    render(<PlusMinusControl value={2} maxValue={2} onChange={mockChangeHandler} />)
    await userEvent.click(screen.getByTestId('plus-minus-control-plus'))
    await waitFor(() => {
      expect(mockChangeHandler).not.toBeCalled()
    })
  })
})
