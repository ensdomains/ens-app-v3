import { mockFunction, render, screen, userEvent } from '@app/test-utils'

import { act, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'

import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { SearchInput } from './SearchInput'
import { SearchResult } from './SearchResult'

vi.mock('next/router', async () => await vi.importActual('next-router-mock'))
vi.mock('@app/utils/BreakpointProvider')
vi.mock('@app/hooks/useLocalStorage')
vi.mock('./SearchResult')

const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseLocalStorage = mockFunction(useLocalStorage)
const mockSearchResult = mockFunction(SearchResult)

mockSearchResult.mockImplementation(({ searchItem }) => (
  <div data-testid="search-result-text">{searchItem.text}</div>
))

window.scroll = vi.fn() as () => void

describe('SearchInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLocalStorage.mockReturnValue([[]])
    window.ResizeObserver = vi.fn()
    ;(window.ResizeObserver as Mock).mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render on desktop layouts', () => {
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })
    render(<SearchInput />)
    expect(screen.getByTestId('search-input-desktop')).toBeVisible()
  })
  it('should render on mobile layouts', () => {
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    })
    render(<SearchInput />)
    expect(screen.getByTestId('search-input-mobile')).toBeVisible()
  })
  it('should show a popup with backdrop when clicked on mobile', async () => {
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: false,
      md: false,
      lg: false,
      xl: false,
    })
    render(<SearchInput />)

    act(() => {
      screen.getByTestId('search-input-box-fake').click()
    })

    await waitFor(() => screen.getByTestId('backdrop-surface'), {
      timeout: 500,
    }).then((el) => expect(el).toBeVisible())
  })
  it('should show info text on click', async () => {
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })
    render(<SearchInput />)
    act(() => {
      screen.getByTestId('search-input-box').focus()
    })

    await waitFor(() => screen.getByTestId('search-result-text'), {
      timeout: 500,
    }).then((el) => expect(el).toHaveTextContent('search.emptyText'))

    expect(screen.getByTestId('search-input-box')).not.toHaveTextContent('Search for a name')
  })
  it('should show history items if available', async () => {
    mockUseLocalStorage.mockReturnValue([
      [
        {
          nameType: 'eth',
          text: 'nick.eth',
        },
        {
          nameType: 'address',
          text: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
        },
        {
          nameType: 'eth',
          text: 'test.eth',
        },
      ],
    ])
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })
    render(<SearchInput />)
    act(() => {
      screen.getByTestId('search-input-box').focus()
    })
    await waitFor(() => screen.getByTestId('search-input-results'), {
      timeout: 500,
    })

    expect(screen.getByText('nick.eth')).toBeInTheDocument()
    expect(screen.getByText('0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9')).toBeInTheDocument()
    expect(screen.getByText('test.eth')).toBeInTheDocument()
  })
  it('should show history items in correct order', async () => {
    mockUseLocalStorage.mockReturnValue([
      [
        {
          nameType: 'eth',
          text: 'nick.eth',
          lastAccessed: 1,
        },
        {
          nameType: 'address',
          text: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
          lastAccessed: 3,
        },
        {
          nameType: 'name',
          text: 'test.eth',
          lastAccessed: 2,
        },
      ],
    ])
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })
    render(<SearchInput />)
    act(() => {
      screen.getByTestId('search-input-box').focus()
    })
    const container = await waitFor(() => screen.getByTestId('search-input-results'), {
      timeout: 500,
    })

    expect(container.children[0]).toHaveTextContent('0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9')
    expect(container.children[1]).toHaveTextContent('test.eth')
    expect(container.children[2]).toHaveTextContent('nick.eth')
  })
  it('should show a maximum of 6 history items', async () => {
    mockUseLocalStorage.mockReturnValue([
      [
        {
          nameType: 'eth',
          text: 'nick.eth',
        },
        {
          nameType: 'address',
          text: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
        },
        {
          nameType: 'eth',
          text: 'test.eth',
        },
        {
          nameType: 'eth',
          text: 'test1.eth',
        },
        {
          nameType: 'eth',
          text: 'test2.eth',
        },
        {
          nameType: 'eth',
          text: 'test3.eth',
        },
        {
          nameType: 'eth',
          text: 'test4.eth',
        },
      ],
    ])
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })
    render(<SearchInput />)
    act(() => {
      screen.getByTestId('search-input-box').focus()
    })
    await waitFor(() => screen.getByTestId('search-input-results'), {
      timeout: 500,
    })

    expect(screen.getByText('test2.eth')).toBeInTheDocument()
    expect(screen.queryByText('test4.eth')).not.toBeInTheDocument()
  })
  it('should show address search as valid', async () => {
    const address = '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9'
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })
    render(<SearchInput />)
    act(() => {
      screen.getByTestId('search-input-box').focus()
    })
    await waitFor(() => screen.getByTestId('search-input-results'), {
      timeout: 500,
    })

    await userEvent.type(screen.getByTestId('search-input-box'), address)

    await waitFor(() =>
      expect(screen.queryByText(`${address.toLowerCase()}.eth`)).toBeInTheDocument(),
    )
  })
  it('should show invalid search as invalid', async () => {
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })
    render(<SearchInput />)
    act(() => {
      screen.getByTestId('search-input-box').focus()
    })
    await waitFor(() => screen.getByTestId('search-input-results'), {
      timeout: 500,
    })
    await userEvent.type(screen.getByTestId('search-input-box'), '.')
    await waitFor(() => expect(screen.queryByText(`Invalid name`)).toBeInTheDocument())
  })
  it('should debounce search input changes', async () => {
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })

    render(<SearchInput />)
    const input = screen.getByTestId('search-input-box')

    await userEvent.click(input)

    await waitFor(() => {
      screen.getByTestId('search-input-results')
    })

    await userEvent.clear(input)
    await userEvent.type(input, 'test')

    await waitFor(
      () => {
        const results = screen.getByTestId('search-input-results')
        expect(results).toBeInTheDocument()
        expect(results).toHaveTextContent('test.eth')
      },
      {
        timeout: 300,
      },
    )
  })

  it('should cancel pending debounced search on rapid typing', async () => {
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })

    render(<SearchInput />)
    const input = screen.getByTestId('search-input-box')

    await userEvent.click(input)

    await waitFor(() => {
      screen.getByTestId('search-input-results')
    })

    await userEvent.clear(input)

    await userEvent.type(input, 'te')
    await userEvent.type(input, 'st')

    await waitFor(
      () => {
        const results = screen.getByTestId('search-input-results')
        expect(results).toBeInTheDocument()
        expect(results).toHaveTextContent('test.eth')
      },
      {
        timeout: 300,
      },
    )
  })

  it('should debounce placeholder state when typing', async () => {
    mockSearchResult.mockClear()
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })

    render(<SearchInput />)
    const input = screen.getByTestId('search-input-box')

    await userEvent.click(input)
    await userEvent.clear(input)
    await userEvent.type(input, 'test')

    // Check that SearchResult is called with usingPlaceholder=true initially
    expect(mockSearchResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        usingPlaceholder: true,
      }),
      expect.anything(),
    )

    // Wait for debounce to complete
    await waitFor(
      () => {
        // Check that SearchResult is called with usingPlaceholder=false after debounce
        expect(mockSearchResult).toHaveBeenLastCalledWith(
          expect.objectContaining({
            usingPlaceholder: false,
          }),
          expect.anything(),
        )
      },
      {
        timeout: 300,
      },
    )
  })

  it('should reset placeholder state on rapid typing', async () => {
    mockSearchResult.mockClear()
    mockUseBreakpoint.mockReturnValue({
      xs: true,
      sm: true,
      md: true,
      lg: false,
      xl: false,
    })

    render(<SearchInput />)
    const input = screen.getByTestId('search-input-box')

    await userEvent.click(input)
    await userEvent.clear(input)

    // Type first part
    await userEvent.type(input, 'te')
    expect(mockSearchResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        usingPlaceholder: true,
      }),
      expect.objectContaining({}),
    )

    // Type second part immediately
    await userEvent.type(input, 'st')
    expect(mockSearchResult).toHaveBeenLastCalledWith(
      expect.objectContaining({
        usingPlaceholder: true,
      }),
      expect.objectContaining({}),
    )

    // Wait for debounce to complete
    await waitFor(
      () => {
        expect(mockSearchResult).toHaveBeenLastCalledWith(
          expect.objectContaining({
            usingPlaceholder: false,
          }),
          expect.anything(),
        )
      },
      {
        timeout: 350,
      },
    )
  })
})
