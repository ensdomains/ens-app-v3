/* eslint-disable @typescript-eslint/naming-convention */
import { keepPreviousData } from '@tanstack/react-query'
import { Key, ReactNode, useCallback, useMemo, useState } from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import styled, { css, DefaultTheme, keyframes } from 'styled-components'
import { useAccount, useClient } from 'wagmi'

import {
  AlertSVG,
  Button,
  Dialog,
  Heading,
  MagnifyingGlassSVG,
  Typography,
} from '@ensdomains/thorin'

import { LegacyDropdown } from '@app/components/@molecules/LegacyDropdown/LegacyDropdown'
import { SpinnerRow } from '@app/components/@molecules/ScrollBoxWithSpinner'
import { useChainName } from '@app/hooks/chain/useChainName'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useOwners } from '@app/hooks/useOwners'
import { getSupportedChainContractAddress } from '@app/utils/getSupportedChainContractAddress'
import { useInfiniteQuery } from '@app/utils/query/useInfiniteQuery'

import { DialogInput } from '../../DialogComponentVariants/DialogInput'

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

async function getNfts({
  network,
  owner,
  pageKey,
}: {
  network: string
  owner: string
  pageKey: string
}) {
  const baseURL = `https://ens-nft-worker.ens-cf.workers.dev/v1/${network}/getNfts/`

  const urlParams = new URLSearchParams()

  urlParams.append('owner', owner)
  urlParams.append('filters[]', 'SPAM')

  if (pageKey) {
    urlParams.append('pageKey', pageKey)
  }

  const res = await fetch(`${baseURL}?${urlParams.toString()}`, {
    method: 'GET',
    redirect: 'follow',
  })

  return (await res.json()) as NFTResponse
}

function useNtfs(chain: string, address: string) {
  const client = useClient()

  return useInfiniteQuery({
    queryKey: [chain, address, 'NFTs'],
    queryFn: async ({ pageParam }) => {
      const response = await getNfts({ network: chain, owner: address, pageKey: pageParam })

      return {
        ...response,
        ownedNfts: response.ownedNfts.filter(
          (nft) =>
            (nft.media?.[0]?.thumbnail || nft.media?.[0]?.gateway) &&
            nft.contract.address !==
              getSupportedChainContractAddress({
                client,
                contract: 'ensBaseRegistrarImplementation',
              }) &&
            nft.contract.address !==
              getSupportedChainContractAddress({
                client,
                contract: 'ensNameWrapper',
              }),
        ),
      }
    },
    initialPageParam: '',
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => lastPage.pageKey,
  })
}

const ScrollBoxContent = styled.div(
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
    width: ${theme.space['36']};

    padding: ${theme.space['2']};
    gap: ${theme.space['2']};

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    opacity: 0.8;

    transition: all 0.15s ease-in-out;
    cursor: pointer;

    color: ${theme.colors.textPrimary};

    &:hover {
      opacity: 1;
    }

    &[aria-disabled='true'] {
      cursor: not-allowed;
      opacity: 1;
      color: ${theme.colors.grey};
    }
  `,
)

const fadeInKeyframes = ({ theme }: { theme: DefaultTheme }) => keyframes`
  from {
    background-color: ${theme.colors.greyLight};
  }
  to {
    background-color: ${theme.colors.greySurface};
  }
`

const NFTImage = styled.img(
  ({ theme }) => css`
    width: ${theme.space['32']};
    height: ${theme.space['32']};

    border-radius: ${theme.radii['2xLarge']};
    object-fit: cover;
    animation: ${fadeInKeyframes} 2s infinite alternate ease-in-out;
    background-color: ${theme.colors.backgroundSecondary};

    &[data-image-state='loaded'] {
      animation: none;
    }
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
    color: inherit;
  `,
)

const SelectedNFTContainer = styled.div(({ theme }) => [
  css`
    width: 100%;
    & div {
      padding: 0 ${theme.radii['2.5xLarge']};
      &:first-of-type {
        font-size: ${theme.fontSizes.headingThree};
      }
    }
    @media (min-width: ${theme.breakpoints.sm}px) {
      width: calc(80vw - 2 * ${theme.space['6']});
      max-width: ${theme.space['128']};
    }
  `,
])

const SelectedNFTImageWrapper = styled.div(
  () => css`
    display: flex;
    justify-content: center;
  `,
)

const SelectedNFTImage = styled.img(
  ({ theme }) => css`
    width: ${theme.space.full};
    max-width: ${theme.space['72']};
    border-radius: ${theme.radii['2.5xLarge']};
    margin-bottom: ${theme.space['2']};
  `,
)

const FilterContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${theme.space['4']};
    margin-bottom: ${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      margin-bottom: ${theme.space['6']};
    }
  `,
)

// Keeps the source selector at its content width (so the search input takes the rest)
// and bottom-aligns it with the DialogInput, which pulls itself up by the same amount.
const SourceSelectorContainer = styled.div(
  ({ theme }) => css`
    flex-shrink: 0;
    margin-bottom: -${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      margin-bottom: -${theme.space['6']};
    }
  `,
)

const LoadingContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    min-height: ${theme.space['32']};

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: ${theme.space['4']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      gap: ${theme.space['6']};
    }
  `,
)

const LoadFailureContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space['32']};
    height: ${theme.space['32']};

    padding: ${theme.space['4']};

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['1']};

    border-radius: ${theme.radii['2xLarge']};

    background-color: ${theme.colors.greySurface};
    color: ${theme.colors.grey};

    & > svg {
      width: ${theme.space['5']};
      height: ${theme.space['5']};
    }
  `,
)

const NftItem = ({
  t,
  nft,
  setSelectedNft,
  i,
}: {
  t: TFunction
  nft: OwnedNFT
  setSelectedNft: (i: number) => void
  i: number
}) => {
  const [loadState, setLoadState] = useState<'loading' | 'error' | 'loaded'>('loading')
  return (
    <NFTContainer
      data-testid={`nft-${nft.id.tokenId}-${nft.contract.address}`}
      as="button"
      onClick={(e) => {
        e.preventDefault()
        if (loadState === 'loaded') setSelectedNft(i)
      }}
      aria-disabled={loadState !== 'loaded'}
    >
      {loadState !== 'error' ? (
        <NFTImage
          src={nft.media[0].thumbnail || nft.media[0].gateway}
          loading="lazy"
          onError={() => setLoadState('error')}
          onLoad={() => setLoadState('loaded')}
          data-image-state={loadState}
          data-testid={`nft-image-${nft.id.tokenId}-${nft.contract.address}`}
        />
      ) : (
        <LoadFailureContainer>
          <AlertSVG />
          <Typography fontVariant="smallBold" color="grey">
            {t('input.profileEditor.tabs.avatar.nft.loadError')}
          </Typography>
        </LoadFailureContainer>
      )}
      <NFTName>{nft.title || t('input.profileEditor.tabs.avatar.nft.unknown')}</NFTName>
    </NFTContainer>
  )
}

type AvatarSource = {
  address: string
  // i18n key for the source's role label. Owner rows resolve in the `common`
  // namespace (see `ns`); wallet/eth rows use the component's `transactionFlow` default.
  labelKey: string
  ns?: 'common'
  testId: string
}

// Ordered, case-insensitively deduped set of addresses whose NFTs can be browsed as
// an avatar source: the connected wallet (default), the name's manager/owner rows
// (from `useOwners`), and the eth address record. Connected wallet is kept first so
// the default browsing behaviour is unchanged.
function useAvatarSources(name: string, connectedAddress?: string): readonly AvatarSource[] {
  const { profile, ownerData, wrapperData } = useNameDetails({ name })
  const owners = useOwners({ ownerData, wrapperData })

  return useMemo(() => {
    const ethAddress = (profile?.coins ?? []).find((coin) => coin.name.toLowerCase() === 'eth')
      ?.value

    const candidates: AvatarSource[] = [
      ...(connectedAddress
        ? [
            {
              address: connectedAddress,
              labelKey: 'input.profileEditor.tabs.avatar.nft.address.owned',
              testId: 'nft-source-wallet',
            },
          ]
        : []),
      ...owners.map<AvatarSource>((owner) => ({
        address: owner.address,
        labelKey: owner.label,
        ns: 'common',
        testId: `nft-source-${owner.testId}`,
      })),
      ...(ethAddress
        ? [
            {
              address: ethAddress,
              labelKey: 'input.profileEditor.tabs.avatar.nft.address.other',
              testId: 'nft-source-eth-record',
            },
          ]
        : []),
    ]

    const seen = new Set<string>()
    return candidates.filter((source) => {
      if (!source.address) return false
      const key = source.address.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [profile, owners, connectedAddress])
}

export const AvatarNFT = ({
  name,
  handleCancel,
  handleSubmit,
}: {
  name: string
  handleCancel: () => void
  handleSubmit: (type: 'nft', uri: string, display: string) => void
}) => {
  const { t } = useTranslation('transactionFlow')

  const chain = useChainName()
  const { address: _address } = useAccount()
  const address = _address!

  const sources = useAvatarSources(name, _address)

  const [searchedInput, setSearchedInput] = useState('')
  const [selectedAddress, setSelectedAddress] = useState<string>(address)
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null)

  // Resolve the selected source from the (possibly async-changing) source list, falling
  // back to the first source. Both the dropdown label and the NFT query read the resolved
  // source's address, so they can never disagree even if `selectedAddress` drops out of
  // `sources` (e.g. owner data refetches).
  const selectedSource =
    sources.find((source) => source.address.toLowerCase() === selectedAddress.toLowerCase()) ??
    sources[0]
  const fetchAddress = selectedSource?.address ?? selectedAddress

  const { data: NFTPages, fetchNextPage, isLoading } = useNtfs(chain, fetchAddress)

  const NFTs = (NFTPages?.pages ?? [])
    .reduce((prev, curr) => [...prev, ...curr.ownedNfts], [] as OwnedNFT[])
    .filter((nft) => nft.title.toLowerCase().includes(searchedInput))

  const hasNFTs = NFTs && (NFTs.length > 0 || searchedInput !== '')
  const hasNextPage = !!NFTPages?.pages[NFTPages.pages.length - 1].pageKey
  const fetchPage = useCallback(() => fetchNextPage(), [fetchNextPage])

  const getSourceLabel = (source: AvatarSource) =>
    t(source.labelKey, source.ns ? { ns: source.ns } : undefined)

  if (selectedNFT !== null) {
    const nftReference = NFTs?.[selectedNFT]!

    const handleConfirm = () => {
      const string = `eip155:1/${nftReference.id.tokenMetadata.tokenType.toLowerCase()}:${
        nftReference.contract.address
      }/${BigInt(nftReference.id.tokenId).toString()}`
      handleSubmit('nft', string, nftReference.media[0].gateway)
    }

    return (
      <>
        <Dialog.Heading
          title={t('input.profileEditor.tabs.avatar.nft.selected.title')}
          subtitle={t('input.profileEditor.tabs.avatar.nft.selected.subtitle')}
        />
        <Dialog.Content>
          <SelectedNFTContainer>
            <SelectedNFTImageWrapper>
              <SelectedNFTImage src={nftReference.media[0].gateway} />
            </SelectedNFTImageWrapper>
            <Typography weight="bold">
              {nftReference.title || t('input.profileEditor.tabs.avatar.nft.unknown')}
            </Typography>
            <Typography>{nftReference.description}</Typography>
          </SelectedNFTContainer>
        </Dialog.Content>
        <Dialog.Footer
          leading={
            <Button colorStyle="accentSecondary" onClick={() => setSelectedNFT(null)}>
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

  const searchBox = (
    <FilterContainer>
      {sources.length > 1 && (
        <SourceSelectorContainer>
          <LegacyDropdown
            shortThrow
            keepMenuOnTop
            inheritContentWidth
            data-testid="nft-source-selector"
            label={selectedSource ? getSourceLabel(selectedSource) : ''}
            items={sources.map((source) => ({
              label: getSourceLabel(source),
              value: source.address,
              color: 'text',
              onClick: () => {
                setSelectedAddress(source.address)
                setSelectedNFT(null)
              },
              wrapper: (children: ReactNode, key: Key) => (
                <div data-testid={source.testId} key={key}>
                  {children}
                </div>
              ),
            }))}
          />
        </SourceSelectorContainer>
      )}
      <DialogInput
        icon={<MagnifyingGlassSVG />}
        hideLabel
        label="search"
        value={searchedInput}
        onChange={(e) => setSearchedInput(e.target.value)}
        placeholder={t('input.profileEditor.tabs.avatar.nft.searchPlaceholder')}
        data-testid="avatar-search-input"
        clearable
      />
    </FilterContainer>
  )

  if (isLoading) {
    innerContent = (
      <Dialog.Content>
        <LoadingContainer>
          <Heading>{t('input.profileEditor.tabs.avatar.nft.loading')}</Heading>
          <SpinnerRow />
        </LoadingContainer>
      </Dialog.Content>
    )
  } else if (hasNFTs) {
    innerContent = (
      <>
        {searchBox}
        {NFTs.length > 0 ? (
          <Dialog.Content
            data-testid="nft-scroll-box"
            hideDividers={{ top: true }}
            onReachedBottom={fetchPage}
          >
            <ScrollBoxContent>
              {NFTs.map((NFT, i) => (
                <NftItem
                  t={t}
                  nft={NFT}
                  setSelectedNft={setSelectedNFT}
                  i={i}
                  key={`${NFT.id.tokenId}-${NFT.contract.address}`}
                />
              ))}
            </ScrollBoxContent>
            {hasNextPage && <SpinnerRow />}
          </Dialog.Content>
        ) : (
          <Dialog.Content hideDividers={{ top: true }}>
            <LoadingContainer>
              <Heading>{t('input.profileEditor.tabs.avatar.nft.noResults')}</Heading>
            </LoadingContainer>
          </Dialog.Content>
        )}
      </>
    )
  } else {
    innerContent = (
      <Dialog.Content>
        {searchBox}
        <LoadingContainer>
          <Heading>{t('input.profileEditor.tabs.avatar.nft.noNFTs')}</Heading>
        </LoadingContainer>
      </Dialog.Content>
    )
  }

  return (
    <>
      <Dialog.Heading title={t('input.profileEditor.tabs.avatar.nft.title')} />
      {innerContent}
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={handleCancel}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={null}
      />
    </>
  )
}
