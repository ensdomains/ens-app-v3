import { mockFunction, render, screen, userEvent } from '@app/test-utils'

import { act, waitFor } from '@testing-library/react'

import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { SearchInput } from './SearchInput'

jest.mock('@app/utils/BreakpointProvider')
jest.mock('@app/hooks/useLocalStorage')

const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseLocalStorage = mockFunction(useLocalStorage)

window.scroll = jest.fn()

describe('SearchInput', () => {
  mockUseLocalStorage.mockReturnValue([[]])
  window.ResizeObserver = jest.fn()
  ;(window.ResizeObserver as jest.Mock).mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }))

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

    await waitFor(() => screen.getByTestId('search-input-backdrop'), {
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
    await waitFor(() => screen.getByTestId('search-input-results'), {
      timeout: 500,
    }).then((el) => expect(el).toHaveTextContent('search.emptyText'))
    expect(screen.getByTestId('search-input-box')).not.toHaveTextContent('Search for a name')
  })
  it('should show history items if available', async () => {
    mockUseLocalStorage.mockReturnValue([
      [
        {
          type: 'name',
          value: 'nick.eth',
        },
        {
          type: 'address',
          value: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
        },
        {
          type: 'name',
          value: 'test.eth',
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
    expect(screen.getByText('0xb6E040...d28cd9')).toBeInTheDocument()
    expect(screen.getByText('test.eth')).toBeInTheDocument()
  })
  it('should show history items in correct order', async () => {
    mockUseLocalStorage.mockReturnValue([
      [
        {
          type: 'name',
          value: 'nick.eth',
          lastAccessed: 1,
        },
        {
          type: 'address',
          value: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
          lastAccessed: 3,
        },
        {
          type: 'name',
          value: 'test.eth',
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

    expect(container.children[0]).toHaveTextContent('0xb6E040...d28cd9')
    expect(container.children[1]).toHaveTextContent('test.eth')
    expect(container.children[2]).toHaveTextContent('nick.eth')
  })
  it('should show a maximum of 5 history items', async () => {
    mockUseLocalStorage.mockReturnValue([
      [
        {
          type: 'name',
          value: 'nick.eth',
        },
        {
          type: 'address',
          value: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
        },
        {
          type: 'name',
          value: 'test.eth',
        },
        {
          type: 'name',
          value: 'test1.eth',
        },
        {
          type: 'name',
          value: 'test2.eth',
        },
        {
          type: 'name',
          value: 'test3.eth',
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
    expect(screen.queryByText('test3.eth')).not.toBeInTheDocument()
  })
  it('should show address search as valid', async () => {
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
    await userEvent.type(
      screen.getByTestId('search-input-box'),
      '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
    )
    await waitFor(() =>
      expect(screen.getByTestId('search-input-results')).toHaveAttribute('data-error', 'false'),
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
    await waitFor(() =>
      expect(screen.getByTestId('search-input-results')).toHaveAttribute('data-error', 'true'),
    )
  })
})
