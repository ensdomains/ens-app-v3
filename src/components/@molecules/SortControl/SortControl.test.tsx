import { fireEvent, render, screen } from '@app/test-utils'
import SortControl, { SortDirection, SortType, SortValue } from './SortControl'

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
    expect(screen.getByTestId('button-desc')).toBeInTheDocument()
    expect(screen.getByTestId('button-asc')).toBeInTheDocument()
    expect(screen.getByTestId('selected')).toBeInTheDocument()
  })

  it('should display correct values', () => {
    render(<SortControl value={sortValue} onChange={onChange} />)
    expect(screen.getByTestId('selected').textContent).toBe('sortTypes.expiryDate')
    const style = getComputedStyle(screen.getByTestId('button-desc'))
    expect(style.filter).toBe('brightness(0.95)')
    const style2 = getComputedStyle(screen.getByTestId('button-asc'))
    expect(style2.filter).toBe('')
  })

  it('should emit onChange when values are changed', () => {
    render(<SortControl value={sortValue} onChange={onChange} />)
    fireEvent.click(screen.getByTestId('button-asc'))
    expect(onChange.mock.calls[0][0].direction).toEqual('asc')
    fireEvent.click(screen.getByTestId('selected'))
    fireEvent.click(screen.getByText('sortTypes.creationDate'))
    expect(onChange.mock.calls[1][0].type).toEqual(SortType.creationDate)
  })
})
