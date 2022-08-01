/* eslint-disable @typescript-eslint/naming-convention */
import MagnifyingGlassSVG from '@app/assets/MagnifyingGlass.svg'
import {
  Button,
  Dialog,
  Input,
  ScrollBox,
  Spinner,
  Typography,
} from '@ensdomains/thorin'
import { BigNumber } from 'ethers'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

type OwnedNFT = {
  contract: {
    address: string
  }
  id: {
    tokenId: string
    tokenMetadata: {
      tokenType: 'ERC721' | 'ERC1155'
    }
  }
  balance: string
  title: string
  description: string
  tokenUri: {
    raw: string
    gateway: string
  }
  media: {
    raw: string
    gateway: string
    thumbnail?: string
    format?: string
  }[]
  metadata: {
    image: string
    external_url: string
    background_color: string
    name: string
    description: string
    attributes: string
  }
}

type NFTResponse = {
  ownedNfts: OwnedNFT[]
  pageKey: string
  totalCount: number
}

const alchemyKey = 'sSpYuHmhlpuU7RVXq-IIdCdz4IuKF-gM'
const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${alchemyKey}/getNFTs/`

const InnerScrollBox = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(auto-fill, ${theme.space['36']});
  `,
)

const NFTContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['2']};
    gap: ${theme.space['2']};

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    opacity: 0.8;

    transition: all 0.15s ease-in-out;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  `,
)

const NFTImage = styled.img(
  ({ theme }) => css`
    width: ${theme.space['32']};
    height: ${theme.space['32']};

    border-radius: ${theme.radii['2xLarge']};
  `,
)

const NFTName = styled(Typography)(
  ({ theme }) => css`
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 ${theme.space['2']};
    text-align: center;
  `,
)

const SelectedNFTContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']} ${theme.space['16']};

    & div {
      padding: 0 ${theme.radii['2.5xLarge']};
      &:first-of-type {
        font-size: ${theme.fontSizes.headingThree};
      }
    }
  `,
)

const SelectedNFTImage = styled.img(
  ({ theme }) => css`
    width: ${theme.space.full};
    border-radius: ${theme.radii['2.5xLarge']};
    margin-bottom: ${theme.space['2']};
  `,
)

export const AvatarNFT = ({
  handleCancel,
  handleSubmit,
}: {
  handleCancel: () => void
  handleSubmit: (display: string, uri: string) => void
}) => {
  const { t } = useTranslation()

  const { data: addressData } = useAccount()
  const { data: NFTPages, fetchNextPage } = useInfiniteQuery(
    [addressData?.address!, 'NFTs'],
    async ({ pageParam }: { pageParam?: string }) => {
      const urlParams = new URLSearchParams()
      urlParams.append('owner', addressData!.address!)
      urlParams.append('filters[]', 'SPAM')
      if (pageParam) {
        urlParams.append('pageKey', pageParam)
      }
      const response = (await fetch(`${baseURL}?${urlParams.toString()}`, {
        method: 'GET',
        redirect: 'follow',
      }).then((res) => res.json())) as NFTResponse

      return {
        ...response,
        ownedNfts: response.ownedNfts.filter(
          (nft) =>
            (nft.media[0].thumbnail || nft.media[0].gateway) &&
            nft.contract.address !==
              '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
        ),
      } as NFTResponse
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage.pageKey,
    },
  )

  const [searchedInput, setSearchedInput] = useState('')
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null)

  const NFTs = NFTPages?.pages
    .reduce((prev, curr) => [...prev, ...curr.ownedNfts], [] as OwnedNFT[])
    .filter((nft) => nft.title.toLowerCase().includes(searchedInput))

  const hasNextPage = !!NFTPages?.pages[NFTPages.pages.length - 1].pageKey
  const fetchPage = useCallback(() => fetchNextPage(), [fetchNextPage])

  if (selectedNFT !== null) {
    const nftReference = NFTs?.[selectedNFT]!

    const handleConfirm = () => {
      const string = `eip155:1/${nftReference.id.tokenMetadata.tokenType.toLowerCase()}:${
        nftReference.contract.address
      }/${BigNumber.from(nftReference.id.tokenId).toString()}`
      handleSubmit(nftReference.media[0].gateway, string)
    }

    return (
      <>
        <Dialog.Heading
          title="Selected NFT"
          subtitle="Are you sure you want to use this NFT?"
        />
        <SelectedNFTContainer>
          <SelectedNFTImage src={nftReference.media[0].gateway} />
          <Typography weight="bold">
            {nftReference.title || 'Unknown NFT'}
          </Typography>
          <Typography>{nftReference.description}</Typography>
        </SelectedNFTContainer>
        <Dialog.Footer
          leading={
            <Button
              variant="secondary"
              tone="grey"
              shadowless
              onClick={() => setSelectedNFT(null)}
            >
              {t('action.back')}
            </Button>
          }
          trailing={
            <Button shadowless onClick={handleConfirm}>
              {t('action.confirm')}
            </Button>
          }
        />
      </>
    )
  }

  return (
    <>
      <Dialog.Heading title="Select an NFT" />
      <Input
        prefix={<MagnifyingGlassSVG />}
        hideLabel
        label="search"
        value={searchedInput}
        onChange={(e) => setSearchedInput(e.target.value)}
        placeholder="Search for an NFT"
      />
      <ScrollBox style={{ width: '100%' }} onReachedBottom={fetchPage}>
        <InnerScrollBox>
          {NFTs?.map((NFT, i) => (
            <NFTContainer
              as="button"
              onClick={() => setSelectedNFT(i)}
              key={`${NFT.id.tokenId}-${NFT.contract.address}`}
            >
              <NFTImage
                src={NFT.media[0].thumbnail || NFT.media[0].gateway}
                loading="lazy"
              />
              <NFTName weight="bold">{NFT.title || 'Unknown NFT'}</NFTName>
            </NFTContainer>
          ))}
        </InnerScrollBox>
        {hasNextPage && <Spinner />}
      </ScrollBox>
      <Dialog.Footer
        leading={
          <Button
            variant="secondary"
            tone="grey"
            shadowless
            onClick={handleCancel}
          >
            {t('action.cancel')}
          </Button>
        }
        trailing={null}
      />
    </>
  )
}
