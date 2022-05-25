import { useEns } from '@app/utils/EnsProvider'
import { shortenAddress } from '@app/utils/utils'
import { Button, Typography } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { AddressAvatar, AvatarWithZorb } from '../AvatarWithZorb'
import { NFTImage } from '../NFTImage'

const Container = styled.div`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `}
`

const StyledNftBox = styled.div<{ $loading: boolean }>`
  ${({ theme, $loading }) => `
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${$loading ? theme.colors.accentGradient : 'none'};
  border-radius: ${theme.radii['2xLarge']};
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
  & > span {
    border-radius: ${theme.radii['2xLarge']};
  }
  `}
`

const OwnerContainer = styled.div`
  ${({ theme }) => `
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['1.5']};
    flex-gap: ${theme.space['1.5']};
  `}
`

const AvatarWrapper = styled.div`
  ${({ theme }) => `
    width: ${theme.space['5']};
    height: ${theme.space['5']};
  `}
`

const OwnerWithEns = styled.div`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: ${theme.space['0.5']};
    flex-gap: ${theme.space['0.5']};

    & div:last-of-type {
      color: ${theme.colors.textTertiary};
      font-size: ${theme.fontSizes.label};
    }
  `}
`

const NameOwnerItem = ({
  address,
  network,
}: {
  address: string
  network: string
}) => {
  const { getName } = useEns()
  const { data } = useQuery(['getName', address], () => getName(address), {
    enabled: !!address,
  })

  const hasEns = data?.match && data?.name

  if (hasEns) {
    return (
      <OwnerContainer>
        <OwnerWithEns>
          <Typography weight="bold">
            {data.name.length > 12 ? `${data.name.slice(0, 12)}...` : data.name}
          </Typography>
          <Typography weight="bold">{shortenAddress(address)}</Typography>
        </OwnerWithEns>
        <AvatarWrapper>
          <AvatarWithZorb
            label={data.name}
            address={address}
            name={data.name}
            network={network}
          />
        </AvatarWrapper>
      </OwnerContainer>
    )
  }

  return (
    <OwnerContainer>
      <Typography weight="bold">{shortenAddress(address)}</Typography>
      <AvatarWrapper>
        <AddressAvatar address={address} label={address} />
      </AvatarWrapper>
    </OwnerContainer>
  )
}

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const NameDetailContainer = styled.div`
  ${({ theme }) => `
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2.5']};
    flex-gap: ${theme.space['2.5']};
    padding: ${theme.space['4']};
    background-color: ${theme.colors.background};
    border-radius: ${theme.radii['2xLarge']};
    border: ${theme.space.px} solid ${theme.colors.borderTertiary};
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
  `}
`

const ButtonWrapper = styled.div`
  ${({ theme }) => `
    margin-top: ${theme.space['2']};
    & > button {
      border: ${theme.space.px} solid ${theme.colors.borderSecondary};
      border-radius: ${theme.radii.extraLarge};
    }
  `}
`

const LeftText = styled(Typography)`
  ${({ theme }) => `
    color: ${theme.colors.textTertiary};
  `}
`

export const NameDetailSnippet = ({
  name,
  expiryDate,
  ownerData,
  network,
  showButton,
}: {
  name: string
  expiryDate?: Date | null
  ownerData: {
    owner: string
    registrant?: string
  }
  network: string
  showButton?: boolean
}) => {
  const router = useRouter()

  return (
    <NameDetailContainer>
      {expiryDate && (
        <ItemContainer>
          <LeftText weight="bold">Expires</LeftText>
          <Typography weight="bold">{`${expiryDate.toLocaleDateString(
            undefined,
            {
              month: 'long',
            },
          )} ${expiryDate.getDate()}, ${expiryDate.getFullYear()}`}</Typography>
        </ItemContainer>
      )}
      <ItemContainer>
        <LeftText weight="bold">Controller</LeftText>
        <NameOwnerItem address={ownerData.owner} network={network} />
      </ItemContainer>
      {ownerData.registrant && (
        <ItemContainer>
          <LeftText weight="bold">Registrant</LeftText>
          <NameOwnerItem address={ownerData.registrant} network={network} />
        </ItemContainer>
      )}
      {showButton && (
        <ButtonWrapper>
          <Button
            onClick={() =>
              router.push({
                pathname: `/profile/${name}/details`,
                query: {
                  from: router.asPath,
                },
              })
            }
            variant="transparent"
            shadowless
            size="small"
          >
            View Details
          </Button>
        </ButtonWrapper>
      )}
    </NameDetailContainer>
  )
}

export const NameSnippet = ({
  name,
  network,
  expiryDate,
  ownerData,
  showButton,
}: {
  name: string
  network: string
  expiryDate?: Date | null
  ownerData: {
    owner: string
    registrant?: string
  }
  showButton?: boolean
}) => {
  const [nftLoading, setNftLoading] = useState(true)

  return (
    <Container>
      <StyledNftBox $loading={nftLoading}>
        <NFTImage name={name} network={network} callback={setNftLoading} />
      </StyledNftBox>
      <NameDetailSnippet
        name={name}
        expiryDate={expiryDate}
        ownerData={ownerData}
        network={network}
        showButton={showButton}
      />
    </Container>
  )
}
