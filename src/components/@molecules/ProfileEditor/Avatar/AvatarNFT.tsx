/* eslint-disable @typescript-eslint/naming-convention */
import { BigNumber } from 'ethers'
import { ReactNode, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useInfiniteQuery } from 'wagmi'

import { Button, Dialog, Heading, Input, Typography } from '@ensdomains/thorin'

import MagnifyingGlassSVG from '@app/assets/MagnifyingGlass.svg'
import { ScrollBoxWithSpinner, SpinnerRow } from '@app/components/@molecules/ScrollBoxWithSpinner'
import { useChainName } from '@app/hooks/useChainName'

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

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY || 'no-key'
const makeBaseURL = (network: string) =>
  `https://eth-${network}.alchemyapi.io/nft/v2/${alchemyKey}/getNFTs/`

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

const LoadingContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    height: ${theme.space['32']};

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: ${theme.space['4']};
  `,
)

export const AvatarNFT = ({
  handleCancel,
  handleSubmit,
}: {
  handleCancel: () => void
  handleSubmit: (display: string, uri: string) => void
}) => {
  const chain = useChainName()
  const { t } = useTranslation('transactionFlow')

  const { address: _address } = useAccount()
  const address = _address!

  const {
    data: NFTPages,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery(
    [chain, address, 'NFTs'],
    async ({ pageParam }: { pageParam?: string }) => {
      const urlParams = new URLSearchParams()
      urlParams.append('owner', address)
      urlParams.append('filters[]', 'SPAM')
      if (pageParam) {
        urlParams.append('pageKey', pageParam)
      }
      const response = (await fetch(`${makeBaseURL(chain)}?${urlParams.toString()}`, {
        method: 'GET',
        redirect: 'follow',
      }).then((res) => res.json())) as NFTResponse

      return {
        ...response,
        ownedNfts: response.ownedNfts.filter(
          (nft) =>
            (nft.media[0].thumbnail || nft.media[0].gateway) &&
            nft.contract.address !== '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
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
          title={t('input.profileEditor.tabs.avatar.nft.selected.title')}
          subtitle={t('input.profileEditor.tabs.avatar.nft.selected.subtitle')}
        />
        <SelectedNFTContainer>
          <SelectedNFTImage src={nftReference.media[0].gateway} />
          <Typography weight="bold">
            {nftReference.title || t('input.profileEditor.tabs.avatar.nft.unknown')}
          </Typography>
          <Typography>{nftReference.description}</Typography>
        </SelectedNFTContainer>
        <Dialog.Footer
          leading={
            <Button colorScheme="secondary" color="grey" onClick={() => setSelectedNFT(null)}>
              {t('action.back', { ns: 'common' })}
            </Button>
          }
          trailing={
            <Button onClick={handleConfirm}>{t('action.confirm', { ns: 'common' })}</Button>
          }
        />
      </>
    )
  }

  let innerContent: ReactNode

  if (isLoading) {
    innerContent = (
      <LoadingContainer>
        <Heading>{t('input.profileEditor.tabs.avatar.nft.loading')}</Heading>
        <SpinnerRow />
      </LoadingContainer>
    )
  } else if (NFTs && (NFTs.length > 0 || searchedInput !== '')) {
    innerContent = (
      <>
        <Input
          prefix={<MagnifyingGlassSVG />}
          hideLabel
          label="search"
          value={searchedInput}
          onChange={(e) => setSearchedInput(e.target.value)}
          placeholder={t('input.profileEditor.tabs.avatar.nft.searchPlaceholder')}
          data-testid="avatar-search-input"
        />
        {NFTs.length > 0 ? (
          <ScrollBoxWithSpinner
            data-testid="nft-scroll-box"
            style={{ width: '100%' }}
            onReachedBottom={fetchPage}
            showSpinner={hasNextPage}
          >
            <InnerScrollBox>
              {NFTs?.map((NFT, i) => (
                <NFTContainer
                  data-testid={`nft-${NFT.id.tokenId}-${NFT.contract.address}`}
                  as="button"
                  onClick={() => setSelectedNFT(i)}
                  key={`${NFT.id.tokenId}-${NFT.contract.address}`}
                >
                  <NFTImage src={NFT.media[0].thumbnail || NFT.media[0].gateway} loading="lazy" />
                  <NFTName weight="bold">
                    {NFT.title || t('input.profileEditor.tabs.avatar.nft.unknown')}
                  </NFTName>
                </NFTContainer>
              ))}
            </InnerScrollBox>
          </ScrollBoxWithSpinner>
        ) : (
          <LoadingContainer>
            <Heading>{t('input.profileEditor.tabs.avatar.nft.noResults')}</Heading>
          </LoadingContainer>
        )}
      </>
    )
  } else {
    innerContent = (
      <LoadingContainer>
        <Heading>{t('input.profileEditor.tabs.avatar.nft.noNFTs')}</Heading>
      </LoadingContainer>
    )
  }

  return (
    <>
      <Dialog.Heading title={t('input.profileEditor.tabs.avatar.nft.title')} />
      {innerContent}
      <Dialog.Footer
        leading={
          <Button colorScheme="secondary" color="grey" onClick={handleCancel}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={null}
      />
    </>
  )
}
