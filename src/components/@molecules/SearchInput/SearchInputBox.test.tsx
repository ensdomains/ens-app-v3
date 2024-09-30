import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { lightTheme } from '@ensdomains/thorin'

import { SearchInputBox } from './SearchInputBox'

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
    expect(mockSetInput).toHaveBeenCalledTimes(1)

    const searchInput = getByTestId('search-input-box')

    fireEvent.change(searchInput, { target: { value: 't' } })
    await vi.advanceTimersByTime(100)
    expect(mockSetInput).toHaveBeenCalledTimes(1)

    fireEvent.change(searchInput, { target: { value: 'test' } })
    await vi.advanceTimersByTime(499)
    expect(mockSetInput).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTime(1)
    expect(mockSetInput).toHaveBeenCalledTimes(2)
    expect(mockSetInput).toHaveBeenCalledWith('test')

    // Ensure no more calls happen
    await vi.advanceTimersByTime(1000)
    expect(mockSetInput).toHaveBeenCalledTimes(2)
  })
})
