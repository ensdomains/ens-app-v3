/* eslint-disable @typescript-eslint/naming-convention */
import {
  fireEvent,
  mockFunction,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@app/test-utils'

import * as ReactQuery from '@tanstack/react-query'
import React from 'react'
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { useAccount, useClient } from 'wagmi'

import { useNameDetails } from '@app/hooks/useNameDetails'
import * as UseInfiniteQuery from '@app/utils/query/useInfiniteQuery'

import { makeMockIntersectionObserver } from '../../../../../test/mock/makeMockIntersectionObserver'
import { AvatarNFT } from './AvatarNFT'

vi.mock('wagmi')
vi.mock('@app/hooks/chain/useCurrentBlockTimestamp', () => ({
  default: () => new Date(),
}))
vi.mock('@app/hooks/chain/useChainName', () => ({
  useChainName: () => 'mainnet',
}))
vi.mock('@app/hooks/useNameDetails')

const mockUseClient = mockFunction(useClient)
const mockUseAccount = mockFunction(useAccount)
const mockUseNameDetails = mockFunction(useNameDetails)

const CONNECTED_ADDRESS = '0x0000000000000000000000000000000000000001'
const MANAGER_ADDRESS = '0x0000000000000000000000000000000000000002'
const REGISTRANT_ADDRESS = '0x0000000000000000000000000000000000000003'
const ETH_RECORD_ADDRESS = '0x0000000000000000000000000000000000000004'

// The `owner` query param each getNfts fetch was called with, in call order.
const fetchedOwners = () =>
  (fetch as unknown as Mock).mock.calls.map((call) =>
    new URL(call[0] as string).searchParams.get('owner'),
  )

const mockHandleSubmit = vi.fn()
const mockHandleCancel = vi.fn()

makeMockIntersectionObserver()

const props = {
  name: 'test',
  handleSubmit: mockHandleSubmit,
  handleCancel: mockHandleCancel,
}

const generateNFT = (withMedia: boolean, contractAddress?: string) => (_: any, i: number) => ({
  contract: {
    address: contractAddress || `0x${i.toString(16)}`,
  },
  id: {
    tokenId: String(i),
    tokenMetadata: {
      tokenType: Math.random() > 0.5 && i > 1 ? 'ERC721' : 'ERC1155',
    },
  },
  balance: '1',
  title: `NFT ${i}`,
  description: `NFT ${i} description`,
  tokenUri: {
    raw: 'https://localhost/test-uri-raw.png',
    gateway: 'https://localhost/test-uri-gateway.png',
  },
  media: withMedia
    ? [
        {
          raw: 'https://localhost/test-media-raw.png',
          gateway: 'https://localhost/test-media-gateway.png',
          thumbnail: 'https://localhost/test-media-thumbnail.png',
        },
      ]
    : [],
  metadata: {
    image: 'https://localhost/test-meta-image.png',
    external_url: 'https://localhost/',
    background_color: '#000000',
    name: `NFT ${i}`,
    description: `NFT ${i} description`,
    attributes: '{"test": "test"}',
  },
})

let mockFetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ownedNfts: Array.from({ length: 5 }, generateNFT(true)),
    totalCount: 5,
  }),
)
// @ts-ignore
global.fetch = vi.fn(() => Promise.resolve({ json: mockFetch }))

beforeEach(() => {
  mockFetch.mockClear()
  mockFetch = vi.fn()
  ;(fetch as unknown as Mock).mockClear()
  mockUseAccount.mockReturnValue({ address: `0x${Date.now()}` })
  // Default: no owner rows and no eth record, so the only source is the connected
  // wallet and the source selector stays hidden (matching pre-feature behaviour).
  mockUseNameDetails.mockReturnValue({
    profile: { coins: [] },
    ownerData: undefined,
    wrapperData: undefined,
  })
  mockUseClient.mockReturnValue({
    chain: {
      id: 1,
      contracts: {
        ensBaseRegistrarImplementation: { address: '0xensBaseRegistrarImplementation' },
        ensNameWrapper: { address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85' },
      },
    },
  })
})

describe('<AvatarNFT />', () => {
  window.IntersectionObserver = vi.fn()
  ;(window.IntersectionObserver as Mock).mockImplementation(() => ({
    observe: vi.fn(),
    disconnect: vi.fn(),
  }))
  mockUseAccount.mockReturnValue({
    address: '0x0000000000000000000000000000000000000001',
  })
  it('should show detail on click', async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ownedNfts: Array.from({ length: 5 }, generateNFT(true)),
        totalCount: 5,
      }),
    )
    render(<AvatarNFT {...props} />)

    await waitFor(() => expect(screen.getByTestId('nft-0-0x0')).toBeVisible())
    fireEvent.load(screen.getByTestId('nft-image-0-0x0'))
    await waitFor(() => expect(screen.getByTestId('nft-0-0x0')).toBeEnabled())
    fireEvent.click(screen.getByTestId('nft-0-0x0'))
    await waitFor(() => expect(screen.getByText('NFT 0 description')).toBeVisible(), {
      timeout: 1000,
    })
  })
  it('should correctly call submit callback', async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ownedNfts: Array.from({ length: 5 }, generateNFT(true)),
        totalCount: 5,
      }),
    )
    render(<AvatarNFT {...props} />)

    await waitFor(() => expect(screen.getByTestId('nft-0-0x0')).toBeVisible())
    fireEvent.load(screen.getByTestId('nft-image-0-0x0'))
    await waitFor(() => expect(screen.getByTestId('nft-0-0x0')).toBeEnabled())
    fireEvent.click(screen.getByTestId('nft-0-0x0'))
    await waitFor(() => expect(screen.getByText('NFT 0 description')).toBeVisible())
    fireEvent.click(screen.getByText('action.confirm'))
    await waitFor(() =>
      expect(mockHandleSubmit).toHaveBeenCalledWith(
        'nft',
        'eip155:1/erc1155:0x0/0',
        'https://localhost/test-media-gateway.png',
      ),
    )
  })
  it('should display all NFTs', async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ownedNfts: Array.from({ length: 5 }, generateNFT(true)),
        totalCount: 5,
      }),
    )
    render(<AvatarNFT {...props} />)

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByTestId('nft-0-0x0')).toBeVisible())
    expect(screen.getByText('NFT 0')).toBeVisible()
    expect(screen.getByTestId('nft-1-0x1')).toBeVisible()
    expect(screen.getByTestId('nft-2-0x2')).toBeVisible()
    expect(screen.getByTestId('nft-3-0x3')).toBeVisible()
    expect(screen.getByTestId('nft-4-0x4')).toBeVisible()
  })
  it('should not display ENS NFTs', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ownedNfts: Array.from(
          { length: 5 },
          generateNFT(true, '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'),
        ),
        totalCount: 5,
      }),
    )

    render(<AvatarNFT {...props} />)

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    await waitFor(() =>
      expect(
        screen.queryByTestId('nft-0-0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'),
      ).not.toBeInTheDocument(),
    )
  })
  it('should not display NFTs with no media', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ownedNfts: Array.from({ length: 5 }, generateNFT(false)),
        totalCount: 5,
      }),
    )
    render(<AvatarNFT {...props} />)

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    await waitFor(() => expect(screen.queryByTestId('nft-0-0x0')).not.toBeInTheDocument())
  })
  it('show load more data on page load trigger', async () => {
    const useInfiniteQuerySpy = vi.spyOn(UseInfiniteQuery, 'useInfiniteQuery')

    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ownedNfts: Array.from({ length: 5 }, generateNFT(true)),
          totalCount: 5,
          pageKey: 'test123',
        }),
      )
      .mockImplementation(() =>
        Promise.resolve({
          ownedNfts: Array.from({ length: 5 }, generateNFT(true)),
          totalCount: 5,
          pageKey: 'test456',
        }),
      )
    vi.mock('@ensdomains/thorin', async (importActual) => ({
      ...((await importActual()) as any),
      ScrollBox:
        () =>
        ({
          children,
          onReachedBottom,
        }: React.PropsWithChildren<{
          onReachedBottom?: () => void
        }>) => {
          onReachedBottom!()
          return <div>{children}</div>
        },
    }))

    render(<AvatarNFT {...props} />)
    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    expect(useInfiniteQuerySpy).toHaveBeenCalledTimes(2)

    const lastCall = useInfiniteQuerySpy.mock.lastCall
    if (!lastCall) {
      throw new Error('useInfiniteQuery was not called as expected')
    }
    const options = lastCall[0]
    if (typeof options !== 'object' || !options || !('queryFn' in options)) {
      throw new Error('useInfiniteQuery options do not contain queryFn')
    }
    const { queryFn } = options as { queryFn: ReactQuery.QueryFunction }
    const mockContext = {
      pageParam: 'test123',
    }
    await queryFn(mockContext as any)
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    // @ts-ignore
    expect(fetch.mock.lastCall[0]).toMatch(/pageKey=test123/)
  })
  it('show not load more data on page load trigger if no more pages', async () => {
    mockUseAccount.mockReturnValue({ address: '0x123' })
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ownedNfts: Array.from({ length: 5 }, generateNFT(true)),
        totalCount: 5,
      }),
    )

    vi.mock('@ensdomains/thorin', async (importActual) => ({
      ...((await importActual()) as any),
      ScrollBox:
        () =>
        ({
          children,
          onReachedBottom,
        }: React.PropsWithChildren<{
          onReachedBottom?: () => void
        }>) => {
          onReachedBottom!()
          return <div>{children}</div>
        },
    }))

    render(<AvatarNFT {...props} />)

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
  })

  it('should show message if search returns no results', async () => {
    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ownedNfts: Array.from({ length: 5 }, generateNFT(true)),
          totalCount: 5,
        }),
      )
      .mockImplementation(() =>
        Promise.resolve({
          ownedNfts: [],
          totalCount: 0,
        }),
      )

    render(<AvatarNFT {...props} />)
    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
    const searchInput = screen.getByTestId('avatar-search-input')
    await userEvent.type(searchInput, 'blahblahblah')
    await waitFor(() =>
      expect(screen.getByText('input.profileEditor.tabs.avatar.nft.noResults')).toBeVisible(),
    )
  })

  describe('avatar source selector', () => {
    // Legacy (unwrapped) name owned by manager + registrant, with an eth address record.
    const mockLegacyName = () => {
      mockUseAccount.mockReturnValue({ address: CONNECTED_ADDRESS })
      mockUseNameDetails.mockReturnValue({
        profile: { coins: [{ id: 60, name: 'eth', value: ETH_RECORD_ADDRESS }] },
        ownerData: { owner: MANAGER_ADDRESS, registrant: REGISTRANT_ADDRESS },
        wrapperData: undefined,
      })
    }

    beforeEach(() => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ownedNfts: Array.from({ length: 5 }, generateNFT(true)),
          totalCount: 5,
        }),
      )
    })

    const clickSource = (testId: string) =>
      fireEvent.click(within(screen.getByTestId(testId)).getByRole('button', { hidden: true }))

    it('defaults to browsing the connected wallet NFTs', async () => {
      mockLegacyName()
      render(<AvatarNFT {...props} />)

      await waitFor(() => expect(fetch).toHaveBeenCalled())
      expect(fetchedOwners()[0]).toBe(CONNECTED_ADDRESS)
    })

    it('lists connected wallet, manager, owner and eth record as deduped sources', async () => {
      mockLegacyName()
      render(<AvatarNFT {...props} />)

      const selector = await screen.findByTestId('nft-source-selector')
      expect(within(selector).getByTestId('nft-source-wallet')).toBeInTheDocument()
      expect(within(selector).getByTestId('nft-source-owner-button-owner')).toBeInTheDocument()
      expect(
        within(selector).getByTestId('nft-source-owner-button-registrant'),
      ).toBeInTheDocument()
      expect(within(selector).getByTestId('nft-source-eth-record')).toBeInTheDocument()

      // Assert each source's rendered label key, so a swapped labelKey (e.g. manager vs
      // owner, or wallet vs eth record) fails here even though the testIds are unchanged.
      // (The test i18n mock ignores the `ns` option, so namespace routing isn't asserted.)
      expect(
        within(screen.getByTestId('nft-source-wallet')).getByText(
          'input.profileEditor.tabs.avatar.nft.address.owned',
        ),
      ).toBeInTheDocument()
      expect(
        within(screen.getByTestId('nft-source-owner-button-owner')).getByText('name.manager'),
      ).toBeInTheDocument()
      expect(
        within(screen.getByTestId('nft-source-owner-button-registrant')).getByText('name.owner'),
      ).toBeInTheDocument()
      expect(
        within(screen.getByTestId('nft-source-eth-record')).getByText(
          'input.profileEditor.tabs.avatar.nft.address.other',
        ),
      ).toBeInTheDocument()
    })

    it('refetches with the selected source address as owner', async () => {
      mockLegacyName()
      render(<AvatarNFT {...props} />)

      await screen.findByTestId('nft-source-selector')

      clickSource('nft-source-owner-button-registrant')
      await waitFor(() => expect(fetchedOwners()).toContain(REGISTRANT_ADDRESS))

      clickSource('nft-source-eth-record')
      await waitFor(() => expect(fetchedOwners()).toContain(ETH_RECORD_ADDRESS))
    })

    it('collapses to a single source and hides the selector when addresses match case-insensitively', async () => {
      const lower = `0x${'a'.repeat(40)}` as `0x${string}`
      const upper = `0x${'A'.repeat(40)}` as `0x${string}`
      mockUseAccount.mockReturnValue({ address: lower })
      mockUseNameDetails.mockReturnValue({
        profile: { coins: [{ id: 60, name: 'eth', value: upper }] },
        ownerData: { owner: upper, registrant: upper },
        wrapperData: undefined,
      })

      render(<AvatarNFT {...props} />)

      await waitFor(() => expect(screen.getByTestId('avatar-search-input')).toBeInTheDocument())
      expect(screen.queryByTestId('nft-source-selector')).not.toBeInTheDocument()
      expect(fetchedOwners().every((owner) => owner === lower)).toBe(true)
    })

    it('surfaces a wrapped name owner as one source without a separate registrant', async () => {
      mockUseAccount.mockReturnValue({ address: CONNECTED_ADDRESS })
      mockUseNameDetails.mockReturnValue({
        profile: { coins: [] },
        ownerData: { owner: MANAGER_ADDRESS, registrant: REGISTRANT_ADDRESS },
        wrapperData: {
          owner: MANAGER_ADDRESS,
          fuses: { parent: { PARENT_CANNOT_CONTROL: false } },
        },
      })

      render(<AvatarNFT {...props} />)

      const selector = await screen.findByTestId('nft-source-selector')
      expect(within(selector).getByTestId('nft-source-owner-button-manager')).toBeInTheDocument()
      expect(
        within(selector).queryByTestId('nft-source-owner-button-registrant'),
      ).not.toBeInTheDocument()
      expect(within(selector).queryByTestId('nft-source-eth-record')).not.toBeInTheDocument()
    })

    it('submits an NFT picked from a non-connected source', async () => {
      mockLegacyName()
      render(<AvatarNFT {...props} />)

      await screen.findByTestId('nft-source-selector')
      clickSource('nft-source-owner-button-owner')
      await waitFor(() => expect(fetchedOwners()).toContain(MANAGER_ADDRESS))

      await waitFor(() => expect(screen.getByTestId('nft-0-0x0')).toBeVisible())
      fireEvent.load(screen.getByTestId('nft-image-0-0x0'))
      await waitFor(() => expect(screen.getByTestId('nft-0-0x0')).toBeEnabled())
      fireEvent.click(screen.getByTestId('nft-0-0x0'))
      await waitFor(() => expect(screen.getByText('NFT 0 description')).toBeVisible())
      fireEvent.click(screen.getByText('action.confirm'))
      await waitFor(() =>
        expect(mockHandleSubmit).toHaveBeenCalledWith(
          'nft',
          'eip155:1/erc1155:0x0/0',
          'https://localhost/test-media-gateway.png',
        ),
      )
    })
  })
})
