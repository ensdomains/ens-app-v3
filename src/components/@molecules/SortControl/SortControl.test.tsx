import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@app/i18n'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from '@ensdomains/thorin'
import SortControl, { SortValue, SortDirection, SortType } from './SortControl'

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
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={lightTheme}>
          <SortControl value={sortValue} onChange={onChange} />
        </ThemeProvider>
      </I18nextProvider>,
    )
    expect(screen.getByTestId('button-desc')).toBeInTheDocument()
    expect(screen.getByTestId('button-asc')).toBeInTheDocument()
    expect(screen.getByTestId('selected')).toBeInTheDocument()
  })

  it('should display correct values', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={lightTheme}>
          <SortControl value={sortValue} onChange={onChange} />
        </ThemeProvider>
      </I18nextProvider>,
    )
    expect(screen.getByTestId('selected').textContent).toBe('Expiry Date')
    const style = getComputedStyle(screen.getByTestId('button-desc'))
    expect(style.filter).toBe('brightness(0.95)')
    const style2 = getComputedStyle(screen.getByTestId('button-asc'))
    expect(style2.filter).toBe('')
  })

  it('should emit onChange when values are changed', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={lightTheme}>
          <SortControl value={sortValue} onChange={onChange} />
        </ThemeProvider>
      </I18nextProvider>,
    )
    fireEvent.click(screen.getByTestId('button-asc'))
    expect(onChange.mock.calls[0][0].direction).toEqual('asc')
    fireEvent.click(screen.getByTestId('selected'))
    fireEvent.click(screen.getByText('Creation Date'))
    expect(onChange.mock.calls[1][0].type).toEqual(SortType.creationDate)
  })
})
