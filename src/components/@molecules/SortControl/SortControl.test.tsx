import { render, screen, fireEvent, act } from '@testing-library/react'
import SortControl, { SortValue, SortType, SortDirection } from './SortControl'

const sortValue: SortValue = {
  direction: SortDirection.desc,
  type: SortType.expiryDate,
}

const onChange = jest.fn((value: SortValue) => {
  return value
})

describe('SortControl', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    render(<SortControl value={sortValue} onChange={onChange} />)
  })

  it('should display correct values', () => {
    render(<SortControl value={sortValue} onChange={onChange} />)
    expect(screen.getByText('Expiry Date')).toBeVisible()
    expect(screen.getByTestId('button-desc')).toHaveStyle(
      'background-color: rbg(246, 246, 248)',
    )
  })

  it('should emit onChange when values are changed', () => {
    render(<SortControl value={sortValue} onChange={onChange} />)
    act(() => {
      fireEvent.click(screen.getByTestId('button-asc'))
    })
    expect(onChange.mock.calls[0][0].direction).toEqual('asc')
  })
})
