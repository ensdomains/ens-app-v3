import { useChainId } from '@app/hooks/useChainId'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { mockFunction, render, screen } from '@app/test-utils'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { act, waitFor } from '@testing-library/react'
import { SearchInput } from './SearchInput'

jest.mock('@app/utils/BreakpointProvider')
jest.mock('@app/hooks/useLocalStorage')
jest.mock('@app/hooks/useChainId')

const mockUseBreakpoint = mockFunction(useBreakpoint)
const mockUseLocalStorage = mockFunction(useLocalStorage)
const mockUseChainId = mockFunction(useChainId)

window.scroll = jest.fn()

describe('SearchInput', () => {
  mockUseLocalStorage.mockReturnValue([[]])
  mockUseChainId.mockReturnValue(1)

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
    expect(screen.getByTestId('search-input-box')).not.toHaveTextContent(
      'Search for a name',
    )
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
})
