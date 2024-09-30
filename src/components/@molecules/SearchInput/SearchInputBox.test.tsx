import { fireEvent, render, screen } from '@testing-library/react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { ThemeProvider } from 'styled-components'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { lightTheme } from '@ensdomains/thorin'

import { SearchInputBox } from './SearchInputBox'

// Initialize i18next for the tests
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translations'],
  defaultNS: 'translations',
  resources: { en: { translations: {} } },
})

describe('SearchInputBox', () => {
  const mockSetInput = vi.fn()

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={lightTheme}>
        <SearchInputBox
          input=""
          setInput={mockSetInput}
          containerRef={{ current: null }}
          {...props}
        />
      </ThemeProvider>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders correctly', () => {
    const { getByTestId } = renderComponent()
    expect(getByTestId('search-input-box')).toBeDefined()
  })

  it('debounces input and calls setInput once after 500ms', async () => {
    const { getByTestId } = renderComponent()
    // Ensure the initial call is made
    expect(mockSetInput).toHaveBeenCalledTimes(1)

    const searchInput = getByTestId('search-input-box')

    fireEvent.change(searchInput, { target: { value: 't' } })
    await vi.advanceTimersByTime(100)
    // Ensure setInput not called
    expect(mockSetInput).toHaveBeenCalledTimes(1)

    fireEvent.change(searchInput, { target: { value: 'test' } })
    await vi.advanceTimersByTime(499)
    // Ensure setInput not called
    expect(mockSetInput).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTime(1)
    // Ensure setInput called
    expect(mockSetInput).toHaveBeenCalledTimes(2)
    expect(mockSetInput).toHaveBeenCalledWith('test')

    // Ensure no more calls happen
    await vi.advanceTimersByTime(1000)
    expect(mockSetInput).toHaveBeenCalledTimes(2)
  })
})
