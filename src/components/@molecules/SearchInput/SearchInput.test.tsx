import { mockFunction, render, renderHook, screen, userEvent } from '@app/test-utils'

import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import { labelhash } from 'viem'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'

import { GetExpiryReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { mainnetWithEns } from '@app/constants/chains'
import { UseAddressRecordReturnType } from '@app/hooks/ensjs/public/useAddressRecord'
import { UseOwnerReturnType } from '@app/hooks/ensjs/public/useOwner'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { createQueryKey } from '@app/hooks/useQueryOptions'
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

const desktopBreakpoints = { xs: true, sm: true, md: true, lg: false, xl: false }

type SeededChainData = {
  ownerData?: UseOwnerReturnType | null
  wrapperData?: GetWrapperDataReturnType
  expiryData?: GetExpiryReturnType
  addrData?: UseAddressRecordReturnType
}

// `getRouteForSearchItem` reads the chain answers straight out of the query cache, so seeding them
// here is what lets the status guard — rather than the pending guard — decide. Only the fields
// passed in are seeded, which is how a partially warm cache gets reproduced.
const seedChainData = (
  queryClient: QueryClient,
  name: string,
  { ownerData, wrapperData, expiryData, addrData }: SeededChainData,
) => {
  const keyFor = (functionName: 'getOwner' | 'getWrapperData' | 'getExpiry' | 'getAddressRecord') =>
    createQueryKey({
      address: undefined,
      chainId: mainnetWithEns.id,
      functionName,
      queryDependencyType: 'standard',
      params: { name },
    })

  if (ownerData !== undefined) queryClient.setQueryData(keyFor('getOwner'), ownerData)
  if (wrapperData !== undefined) queryClient.setQueryData(keyFor('getWrapperData'), wrapperData)
  if (expiryData !== undefined) queryClient.setQueryData(keyFor('getExpiry'), expiryData)
  if (addrData !== undefined) queryClient.setQueryData(keyFor('getAddressRecord'), addrData)
}

// Every read a short name's row waits on, settled: no owner and no expiry make `12.eth` a name the
// status model calls a dead end.
const unregisteredShortChainData: SeededChainData = {
  ownerData: null,
  wrapperData: null,
  expiryData: null,
  addrData: null,
}

// on.eth predates the registrar's minimum length, so it is a real name with a real profile.
const onEthExpiry = new Date('2036-03-08T00:00:00.000Z')
const registeredShortChainData: SeededChainData = {
  ownerData: {
    owner: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
    registrant: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
    ownershipLevel: 'registrar',
  },
  wrapperData: null,
  expiryData: {
    expiry: { date: onEthExpiry, value: BigInt(onEthExpiry.getTime()) },
    gracePeriod: 60 * 60 * 24 * 90,
    status: 'active',
  },
  addrData: null,
}

const getQueryClient = () => renderHook(() => useQueryClient()).result.current

describe('SearchInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRouter.setCurrentUrl('/')
    mockUseLocalStorage.mockReturnValue([[], vi.fn()])
    mockSearchResult.mockImplementation(({ clickCallback, index, searchItem }) => (
      <button type="button" data-testid="search-result-text" onClick={() => clickCallback(index)}>
        {searchItem.text}
      </button>
    ))
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
  it('should not navigate while a short .eth result has no ownership answer yet', async () => {
    mockUseBreakpoint.mockReturnValue(desktopBreakpoints)
    render(<SearchInput />)

    const input = screen.getByTestId('search-input-box')
    await userEvent.click(input)
    await userEvent.type(input, '12')
    await userEvent.click(await screen.findByRole('button', { name: '12.eth' }))

    expect(mockRouter.asPath).toBe('/')
  })
  it('should not navigate while Enter selects a short .eth result with no ownership answer yet', async () => {
    mockUseBreakpoint.mockReturnValue(desktopBreakpoints)
    render(<SearchInput />)

    const input = screen.getByTestId('search-input-box')
    await userEvent.click(input)
    await userEvent.type(input, '12')
    await screen.findByRole('button', { name: '12.eth' })
    await userEvent.keyboard('{Enter}')

    expect(mockRouter.asPath).toBe('/')
  })
  it('should not navigate when an unregistered short .eth result is clicked', async () => {
    mockUseBreakpoint.mockReturnValue(desktopBreakpoints)
    seedChainData(getQueryClient(), '12.eth', unregisteredShortChainData)
    render(<SearchInput />)

    const input = screen.getByTestId('search-input-box')
    await userEvent.click(input)
    await userEvent.type(input, '12')
    await userEvent.click(await screen.findByRole('button', { name: '12.eth' }))

    expect(mockRouter.asPath).toBe('/')
  })
  it('should not navigate when Enter selects an unregistered short .eth result', async () => {
    mockUseBreakpoint.mockReturnValue(desktopBreakpoints)
    seedChainData(getQueryClient(), '12.eth', unregisteredShortChainData)
    render(<SearchInput />)

    const input = screen.getByTestId('search-input-box')
    await userEvent.click(input)
    await userEvent.type(input, '12')
    await screen.findByRole('button', { name: '12.eth' })
    await userEvent.keyboard('{Enter}')

    expect(mockRouter.asPath).toBe('/')
  })
  // The row itself stays inert until every read its status waits on has settled, so Enter must not
  // jump ahead of the mouse on a half-warm cache — here the owner and expiry answers have landed
  // but the wrapper and addr ones have not.
  it('should not navigate when Enter selects a short .eth result that is only partly cached', async () => {
    mockUseBreakpoint.mockReturnValue(desktopBreakpoints)
    seedChainData(getQueryClient(), 'on.eth', {
      ownerData: registeredShortChainData.ownerData,
      expiryData: registeredShortChainData.expiryData,
    })
    render(<SearchInput />)

    const input = screen.getByTestId('search-input-box')
    await userEvent.click(input)
    await userEvent.type(input, 'on')
    await screen.findByRole('button', { name: 'on.eth' })
    await userEvent.keyboard('{Enter}')

    expect(mockRouter.asPath).toBe('/')
  })
  // This is also the positive control for the seeding above: it proves the guard reads the cache.
  it('should navigate to the profile when a registered short .eth result is clicked', async () => {
    mockUseBreakpoint.mockReturnValue(desktopBreakpoints)
    seedChainData(getQueryClient(), 'on.eth', registeredShortChainData)
    render(<SearchInput />)

    const input = screen.getByTestId('search-input-box')
    await userEvent.click(input)
    await userEvent.type(input, 'on')
    await userEvent.click(await screen.findByRole('button', { name: 'on.eth' }))

    // `/profile/on.eth` is flattened to the app's canonical profile route.
    await waitFor(() => expect(mockRouter.asPath).toBe('/on.eth'))
  })
  it('should navigate to the profile when Enter selects a fully cached registered short .eth result', async () => {
    mockUseBreakpoint.mockReturnValue(desktopBreakpoints)
    seedChainData(getQueryClient(), 'on.eth', registeredShortChainData)
    render(<SearchInput />)

    const input = screen.getByTestId('search-input-box')
    await userEvent.click(input)
    await userEvent.type(input, 'on')
    await screen.findByRole('button', { name: 'on.eth' })
    await userEvent.keyboard('{Enter}')

    await waitFor(() => expect(mockRouter.asPath).toBe('/on.eth'))
  })
  // An unhealed label reads as short to `parseInput`, and the row stays clickable anyway because the
  // short-name predicate refuses to judge a label it cannot read. Enter has to agree: same name, same
  // settled reads, so both paths land on the profile. `pathname` rather than `asPath` because
  // next-router-mock reads the labelhash brackets as a dynamic segment and interpolates them away.
  it('should navigate to the profile when Enter selects an unowned encoded-labelhash result', async () => {
    mockUseBreakpoint.mockReturnValue(desktopBreakpoints)
    const encodedName = `[${labelhash('nick').slice(2)}].eth`
    seedChainData(getQueryClient(), encodedName, unregisteredShortChainData)
    render(<SearchInput />)

    const input = screen.getByTestId('search-input-box')
    await userEvent.click(input)
    await userEvent.paste(encodedName)
    await screen.findByRole('button', { name: encodedName })
    await userEvent.keyboard('{Enter}')

    await waitFor(() => expect(mockRouter.pathname).toBe(`/${encodedName}`))
  })
  it('should navigate to the profile when an unowned encoded-labelhash result is clicked', async () => {
    mockUseBreakpoint.mockReturnValue(desktopBreakpoints)
    const encodedName = `[${labelhash('nick').slice(2)}].eth`
    seedChainData(getQueryClient(), encodedName, unregisteredShortChainData)
    render(<SearchInput />)

    const input = screen.getByTestId('search-input-box')
    await userEvent.click(input)
    await userEvent.paste(encodedName)
    await userEvent.click(await screen.findByRole('button', { name: encodedName }))

    await waitFor(() => expect(mockRouter.pathname).toBe(`/${encodedName}`))
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
