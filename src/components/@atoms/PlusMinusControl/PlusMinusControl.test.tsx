import { fireEvent, render, screen, userEvent, waitFor } from '@app/test-utils'

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
    expect(screen.getByText('unit.years.2')).toBeVisible()
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

  it('should not call onChange if value is at maxValue', async () => {
    render(<PlusMinusControl value={2} maxValue={2} onChange={mockChangeHandler} />)
    await userEvent.click(screen.getByTestId('plus-minus-control-plus'))
    await waitFor(() => {
      expect(mockChangeHandler).not.toBeCalled()
    })
  })

  it('should call onChange if number is inputed', async () => {
    render(<PlusMinusControl value={2} minValue={2} onChange={mockChangeHandler} />)
    const input = screen.getByTestId('plus-minus-control-input')
    await userEvent.click(input)
    await userEvent.type(input, '20')
    expect(mockChangeHandler.mock.calls[0][0].target.value).toEqual('22')
  })

  it('should call onChange with minValue if input is deleted', async () => {
    render(<PlusMinusControl value={4} minValue={2} onChange={mockChangeHandler} />)
    const input = screen.getByTestId('plus-minus-control-input')
    await userEvent.click(input)
    await userEvent.type(input, '{selectall}{backspace}')
    fireEvent.blur(input)
    expect(mockChangeHandler.mock.calls[0][0].target.value).toEqual('4')
  })

  it('should call onChange with 1 if input is deleted and minValue does not exist', async () => {
    render(<PlusMinusControl value={4} onChange={mockChangeHandler} />)
    const input = screen.getByTestId('plus-minus-control-input')
    await userEvent.click(input)
    await userEvent.type(input, '{selectall}{backspace}')
    fireEvent.blur(input)
    expect(mockChangeHandler.mock.calls[0][0].target.value).toEqual('4')
  })
})
