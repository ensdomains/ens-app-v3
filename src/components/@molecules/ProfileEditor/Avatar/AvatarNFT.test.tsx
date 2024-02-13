/* eslint-disable @typescript-eslint/naming-convention */
import { fireEvent, mockFunction, render, screen, userEvent, waitFor } from '@app/test-utils'

import { useAccount } from 'wagmi'

import * as ThorinComponents from '@ensdomains/thorin'

import { AvatarNFT } from './AvatarNFT'

jest.mock('@app/hooks/chain/useChainName', () => ({
  useChainName: () => 'mainnet',
}))

jest.mock('@app/hooks/usePublicClient', () => ({
  usePublicClient: () => ({
    chain: {
      id: 1,
      contracts: {
        ensBaseRegistrarImplementation: { address: '0xensBaseRegistrarImplementation' },
        ensNameWrapper: { address: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85' },
      },
    },
  }),
}))

const mockUseAccount = mockFunction(useAccount)
const mockHandleSubmit = jest.fn()
const mockHandleCancel = jest.fn()

const props = {
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

const mockFetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ownedNfts: Array.from({ length: 5 }, generateNFT(true)),
    totalCount: 5,
  }),
)
// @ts-ignore
global.fetch = jest.fn(() => Promise.resolve({ json: mockFetch }))

beforeEach(() => {
  mockFetch.mockClear()
  mockUseAccount.mockReturnValue({ address: `0x${Date.now()}` })
})

describe('<AvatarNFT />', () => {
  window.IntersectionObserver = jest.fn()
  ;(window.IntersectionObserver as jest.Mock).mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }))
  mockUseAccount.mockReturnValue({
    address: '0x0000000000000000000000000000000000000001',
  })
  it('should show detail on click', async () => {
    render(<AvatarNFT {...props} />)

    await waitFor(() => expect(screen.getByTestId('nft-0-0x0')).toBeVisible())
    fireEvent.click(screen.getByTestId('nft-0-0x0'))
    await waitFor(() => expect(screen.getByText('NFT 0 description')).toBeVisible(), {
      timeout: 1000,
    })
  })
  it('should correctly call submit callback', async () => {
    render(<AvatarNFT {...props} />)

    await waitFor(() => expect(screen.getByTestId('nft-0-0x0')).toBeVisible())
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
    render(<AvatarNFT {...props} />)

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1))
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

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1))
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

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(screen.queryByTestId('nft-0-0x0')).not.toBeInTheDocument())
  })
  it('show load more data on page load trigger', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ownedNfts: Array.from({ length: 5 }, generateNFT(true)),
        totalCount: 10,
        pageKey: 'test123',
      }),
    )

    jest
      .spyOn(ThorinComponents, 'ScrollBox')
      .mockImplementationOnce(({ children, onReachedBottom }) => {
        onReachedBottom!()
        return <div>{children}</div>
      })

    render(<AvatarNFT {...props} />)

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      // @ts-ignore
      expect(fetch.mock.lastCall[1]).toEqual({
        method: 'GET',
        redirect: 'follow',
      }),
    )
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

    jest
      .spyOn(ThorinComponents, 'ScrollBox')
      .mockImplementationOnce(({ children, onReachedBottom }) => {
        onReachedBottom!()
        return <div>{children}</div>
      })

    render(<AvatarNFT {...props} />)

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1))
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
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1))
    const searchInput = screen.getByTestId('avatar-search-input')
    await userEvent.type(searchInput, 'blahblahblah')
    await waitFor(() =>
      expect(screen.getByText('input.profileEditor.tabs.avatar.nft.noResults')).toBeVisible(),
    )
  })
})
