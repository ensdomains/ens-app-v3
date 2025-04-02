/* eslint-disable @typescript-eslint/naming-convention */
import { fireEvent, mockFunction, render, screen, userEvent, waitFor } from '@app/test-utils'

import * as ReactQuery from '@tanstack/react-query'
import React from 'react'
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { useAccount, useClient } from 'wagmi'

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

const mockUseClient = mockFunction(useClient)
const mockUseAccount = mockFunction(useAccount)

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
  mockUseAccount.mockReturnValue({ address: `0x${Date.now()}` })
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

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
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
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(3))
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
})
