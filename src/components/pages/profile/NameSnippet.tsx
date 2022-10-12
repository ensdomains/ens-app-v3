import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useQuery } from 'wagmi'

import { Button, Typography } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { AddressAvatar, AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { ReturnedENS } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
import { getOwnershipArray, shortenAddress } from '@app/utils/utils'

const Container = styled(CacheableComponent)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const OwnerContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['1.5']};
    flex-gap: ${theme.space['1.5']};
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['5']};
    height: ${theme.space['5']};
  `,
)

const OwnerWithEns = styled.div(
  ({ theme }) => css`
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
  `,
)

const NameOwnerItem = ({ address = '', network }: { address?: string; network: number }) => {
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
          <AvatarWithZorb label={data.name} address={address} name={data.name} network={network} />
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

const ItemContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `,
)

const NameDetailContainer = styled(CacheableComponent)(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2.5']};
    flex-gap: ${theme.space['2.5']};
    padding: ${theme.space['4']};
    background-color: ${theme.colors.background};
    border-radius: ${theme.radii['2xLarge']};
    border: ${theme.space.px} solid ${theme.colors.borderTertiary};
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.02);
  `,
)

const ButtonWrapper = styled.div(
  ({ theme }) => css`
    margin-top: ${theme.space['2']};
    & > button {
      border: ${theme.space.px} solid ${theme.colors.borderSecondary};
      border-radius: ${theme.radii.extraLarge};
    }
  `,
)

const LeftText = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

export const NameDetailSnippet = ({
  name,
  expiryDate,
  ownerData,
  network,
  showButton,
  dnsOwner,
  isCached,
  wrapperData,
}: {
  name: string
  expiryDate?: Date | null
  ownerData: Exclude<ReturnedENS['getOwner'], undefined>
  wrapperData: Exclude<ReturnedENS['getWrapperData'], undefined>
  network: number
  showButton?: boolean
  dnsOwner?: string
  isCached?: boolean
}) => {
  const { t } = useTranslation('common')
  const router = useRouter()

  const owners = getOwnershipArray(ownerData, wrapperData, dnsOwner!)

  return (
    <NameDetailContainer $isCached={isCached}>
      {expiryDate && (
        <ItemContainer>
          <LeftText weight="bold">{t('name.expires')}</LeftText>
          <Typography weight="bold">{`${expiryDate.toLocaleDateString(undefined, {
            month: 'long',
          })} ${expiryDate.getDate()}, ${expiryDate.getFullYear()}`}</Typography>
        </ItemContainer>
      )}
      {owners.map(([translation, address]) => (
        <ItemContainer key={translation}>
          <LeftText weight="bold">{t(translation)}</LeftText>
          <NameOwnerItem address={address} network={network} />
        </ItemContainer>
      ))}
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
            {t('wallet.viewDetails')}
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
  dnsOwner,
  isCached,
  wrapperData,
}: {
  name: string
  network: number
  expiryDate?: Date | null
  ownerData: Exclude<ReturnedENS['getOwner'], undefined>
  wrapperData: Exclude<ReturnedENS['getWrapperData'], undefined>
  showButton?: boolean
  dnsOwner?: string
  isCached: boolean
}) => {
  return (
    <Container>
      <NFTWithPlaceholder
        name={name}
        network={network}
        style={{ width: '270px', height: '270px' }}
      />
      <NameDetailSnippet
        isCached={isCached}
        name={name}
        wrapperData={wrapperData}
        expiryDate={expiryDate}
        ownerData={ownerData}
        network={network}
        showButton={showButton}
        dnsOwner={dnsOwner}
      />
    </Container>
  )
}
