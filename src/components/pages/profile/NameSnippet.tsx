import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import type { Address } from 'viem'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { Button, Typography } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { AddressAvatar, AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { shortenAddress } from '@app/utils/utils'

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
      color: ${theme.colors.grey};
      font-size: ${theme.fontSizes.small};
    }
  `,
)

const NameOwnerItem = ({ address }: { address?: Address }) => {
  const { data: nameData } = usePrimaryName({ address })

  if (nameData?.name) {
    return (
      <OwnerContainer>
        <OwnerWithEns>
          <Typography weight="bold">
            {nameData.beautifiedName.length > 12
              ? `${nameData.beautifiedName.slice(0, 12)}...`
              : nameData.beautifiedName}
          </Typography>
          <Typography weight="bold">{shortenAddress(address)}</Typography>
        </OwnerWithEns>
        <AvatarWrapper>
          <AvatarWithZorb label={nameData.name} address={address} name={nameData.name} />
        </AvatarWrapper>
      </OwnerContainer>
    )
  }

  return (
    <OwnerContainer>
      <Typography weight="bold">{shortenAddress(address)}</Typography>
      <AvatarWrapper>
        <AddressAvatar address={address || ''} label={address || ''} />
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
    border: ${theme.space.px} solid ${theme.colors.border};
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.02);
  `,
)

const ButtonWrapper = styled.div(
  ({ theme }) => css`
    margin-top: ${theme.space['2']};
    & > button {
      border: ${theme.space.px} solid ${theme.colors.border};
      border-radius: ${theme.radii.extraLarge};
    }
  `,
)

const LeftText = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.grey};
  `,
)

export const NameDetailSnippet = ({
  name,
  expiryDate,
  ownerData,
  showButton,
  dnsOwner,
  isCached,
  wrapperData,
}: {
  name: string
  expiryDate?: Date | null
  ownerData: NonNullable<GetOwnerReturnType>
  wrapperData: GetWrapperDataReturnType
  showButton?: boolean
  dnsOwner?: Address
  isCached?: boolean
}) => {
  const { t } = useTranslation('common')
  const router = useRouterWithHistory()

  const owners: [translation: string, address: Address][] = []

  if (wrapperData) {
    owners.push([
      wrapperData?.fuses.parent.PARENT_CANNOT_CONTROL ? 'name.owner' : 'name.manager',
      ownerData.owner!,
    ])
  } else {
    if (ownerData.owner) {
      owners.push(['name.manager', ownerData.owner])
    }
    if (ownerData?.registrant) {
      owners.push(['name.owner', ownerData.registrant])
    }
  }
  if (dnsOwner) {
    owners.push(['name.dnsOwner', dnsOwner])
  }

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
          <NameOwnerItem address={address} />
        </ItemContainer>
      ))}
      {showButton && (
        <ButtonWrapper>
          <Button
            onClick={() => router.pushWithHistory(`/profile/${name}/details`)}
            colorStyle="transparent"
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
  expiryDate,
  ownerData,
  showButton,
  dnsOwner,
  isCached,
  wrapperData,
}: {
  name: string
  expiryDate?: Date | null
  ownerData: NonNullable<GetOwnerReturnType>
  wrapperData: GetWrapperDataReturnType
  showButton?: boolean
  dnsOwner?: Address
  isCached: boolean
}) => {
  return (
    <Container>
      <NFTWithPlaceholder name={name} style={{ width: '270px', height: '270px' }} />
      <NameDetailSnippet
        isCached={isCached}
        name={name}
        wrapperData={wrapperData}
        expiryDate={expiryDate}
        ownerData={ownerData}
        showButton={showButton}
        dnsOwner={dnsOwner}
      />
    </Container>
  )
}
