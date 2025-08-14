/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/interactive-supports-focus */
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'
import { Address } from 'viem'
import { useEnsAvatar } from 'wagmi'

import { Avatar, lightTheme, Spinner, Tag, Typography } from '@ensdomains/thorin'

import { useDotBoxAvailabilityOnchain } from '@app/hooks/dotbox/useDotBoxAvailabilityOnchain'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useBasicName } from '@app/hooks/useBasicName'
import { usePrefetchProfile } from '@app/hooks/useProfile'
import { useZorb } from '@app/hooks/useZorb'
import { zorbImageDataURI } from '@app/utils/gradient'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import type { RegistrationStatus } from '@app/utils/registrationStatus'
import { shortenAddress } from '@app/utils/utils'

import type { SearchHandler, SearchItem } from './types'

const SearchItemContainer = styled.div<{
  $selected?: boolean
  $clickable?: boolean
  $error?: boolean
}>(
  ({ theme, $selected, $clickable, $error }) => css`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['2']};
    height: ${theme.space['14']};
    padding: 0 ${theme.space['4']};
    border-bottom: 0.0938rem ${theme.borderStyles.solid} ${theme.colors.border};
    &:last-of-type {
      border-bottom: 0;
    }
    position: relative;
    opacity: 0.6;

    ${!$clickable &&
    css`
      pointer-events: none;
    `}

    ${$clickable &&
    css`
      cursor: pointer;
    `}
    ${$selected &&
    css`
      background-color: ${theme.colors.background};
      opacity: 1;
    `}
    ${$error &&
    css`
      background-color: ${theme.colors.redSurface};
      color: ${theme.colors.red};
    `}
    ${$clickable &&
    $selected &&
    css`
      padding-right: ${theme.space['8']};
      &::after {
        content: '';
        transform: rotate(-90deg);
        mask-image: url('data:image/svg+xml; utf8, <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2552 17.8659C11.6526 18.3095 12.3474 18.3095 12.7448 17.8659L22.5063 6.97001C23.0833 6.32597 22.6262 5.30274 21.7615 5.30274H2.2385C1.37381 5.30274 0.916704 6.32597 1.49369 6.97001L11.2552 17.8659Z" fill="currentColor"/></svg>');
        position: absolute;
        height: ${theme.space['3']};
        width: ${theme.space['3']};
        background-color: ${theme.colors.greyPrimary};
        opacity: 0.4;
        right: ${theme.space['3']};
      }
    `}
  `,
)

const NoInputYetTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.grey};
  `,
)

const placeholderZorb = zorbImageDataURI('placeholder', 'name', {
  accent: lightTheme.colors.accentLight,
  fg: lightTheme.colors.text,
  bg: lightTheme.colors.background,
})
const AvatarWrapper = styled.div<{ $isPlaceholder?: boolean }>(
  ({ theme, $isPlaceholder }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${theme.space['8']};
    min-width: ${theme.space['8']};
    height: ${theme.space['8']};
    flex-grow: 1;
    position: relative;
    ::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url(${placeholderZorb});
      z-index: 1;
      filter: grayscale(100%);
      transition: all 0.2s ease-in-out;
      opacity: 0;
      ${$isPlaceholder &&
      css`
        opacity: 1;
      `}
    }
  `,
)

const LeadingSearchItem = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    max-width: min-content;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    gap: ${theme.space['4.5']};
    flex-gap: ${theme.space['4.5']};
  `,
)

const AddressAndName = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  `,
)

const StyledTag = styled(Tag)(
  () => css`
    width: max-content;
    justify-self: flex-end;
    overflow-wrap: normal;
    word-break: keep-all;
    white-space: nowrap;
  `,
)

const AddressTag = styled(StyledTag)(
  ({ theme }) => css`
    border: 0.0938rem solid ${theme.colors.border};
    background-color: transparent;
  `,
)

const AddressPrimary = styled.div(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.small};
    color: ${theme.colors.greyPrimary};
  `,
)

const SpinnerWrapper = styled.div(
  () => css`
    width: max-content;
    justify-self: flex-end;
  `,
)

const GracePeriodTag = styled(StyledTag)(
  ({ theme }) => css`
    color: ${theme.colors.yellow};
    background-color: ${theme.colors.yellowSurface};
  `,
)

const PremiumTag = styled(StyledTag)(
  ({ theme }) => css`
    color: ${theme.colors.purple};
    background-color: ${theme.colors.purpleSurface};
  `,
)

const StatusTag = ({ status }: { status: RegistrationStatus }) => {
  const { t } = useTranslation('common')
  switch (status) {
    case 'owned':
    case 'imported':
    case 'registered':
      return <StyledTag>{t(`search.status.${status}`)}</StyledTag>
    case 'gracePeriod':
      return <GracePeriodTag>{t(`search.status.${status}`)}</GracePeriodTag>
    case 'premium':
      return <PremiumTag>{t(`search.status.${status}`)}</PremiumTag>
    case 'available':
      return <StyledTag colorStyle="greenSecondary">{t(`search.status.${status}`)}</StyledTag>
    case 'notOwned':
    case 'offChain':
    case 'notImported':
      return <StyledTag colorStyle="blueSecondary">{t(`search.status.${status}`)}</StyledTag>
    case 'short':
      return <StyledTag colorStyle="redSecondary">{t(`search.status.${status}`)}</StyledTag>
    case 'desynced':
    case 'desynced:gracePeriod':
      return <StyledTag colorStyle="redSecondary">{t(`search.status.desynced`)}</StyledTag>
    default:
      return <StyledTag colorStyle="redSecondary">{t(`search.status.${status}`)}</StyledTag>
  }
}

const TextWrapper = styled.div(
  () => css`
    overflow: hidden;
    text-align: left;
    & > div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: clip;
      text-align: left;
      &::before {
        content: '‎';
      }
    }
  `,
)

const getAvatarUri = ({
  usingPlaceholder,
  ensAvatar,
  zorb,
}: {
  usingPlaceholder: boolean
  ensAvatar: string | undefined | null
  zorb: string | undefined
}) => {
  if (ensAvatar) return { avatarUri: ensAvatar, avatarIsPlaceholder: false }
  if (usingPlaceholder || !zorb) return { avatarUri: undefined, avatarIsPlaceholder: true }
  return { avatarUri: zorb, avatarIsPlaceholder: false }
}

const AddressResultItem = ({
  hoverCallback,
  clickCallback,
  index,
  selected,
  searchItem,
  usingPlaceholder,
}: SearchResultProps) => {
  const { text: address } = searchItem
  const { t } = useTranslation('common')
  const { data: primaryName } = usePrimaryName({
    address: address as Address,
    enabled: !usingPlaceholder,
  })
  const { data: ensAvatar } = useEnsAvatar({
    name: primaryName?.name,
    query: { enabled: !usingPlaceholder },
  })
  const zorb = useZorb(address, 'address')

  const { avatarUri, avatarIsPlaceholder } = getAvatarUri({ ensAvatar, usingPlaceholder, zorb })

  return (
    <SearchItemContainer
      data-testid="search-result-address"
      onClick={() => clickCallback(index)}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => hoverCallback(index)}
      $clickable
      $selected={selected}
    >
      <LeadingSearchItem>
        <AvatarWrapper $isPlaceholder={avatarIsPlaceholder}>
          <Avatar src={avatarUri} label="avatar" />
        </AvatarWrapper>
        <AddressAndName>
          <Typography weight="bold">{shortenAddress(address, undefined, 8, 6)}</Typography>
          {primaryName?.name && <AddressPrimary>{primaryName?.beautifiedName}</AddressPrimary>}
        </AddressAndName>
      </LeadingSearchItem>
      <AddressTag>{t('address.label')}</AddressTag>
    </SearchItemContainer>
  )
}

const TldResultItem = ({
  hoverCallback,
  clickCallback,
  index,
  selected,
  searchItem,
  usingPlaceholder,
}: SearchResultProps) => {
  const { text: name } = searchItem
  const { data: ensAvatar } = useEnsAvatar({
    ...ensAvatarConfig,
    name,
    query: { enabled: !usingPlaceholder },
  })
  const zorb = useZorb(usingPlaceholder ? 'placeholder' : name, 'name')
  const { registrationStatus, isLoading, beautifiedName } = useBasicName({
    name,
    enabled: !usingPlaceholder,
  })

  const { avatarUri, avatarIsPlaceholder } = getAvatarUri({ ensAvatar, usingPlaceholder, zorb })

  return (
    <SearchItemContainer
      data-testid="search-result-name"
      onClick={() => clickCallback(index)}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => hoverCallback(index)}
      $clickable
      $selected={selected}
    >
      <LeadingSearchItem>
        <AvatarWrapper $isPlaceholder={avatarIsPlaceholder}>
          <Avatar src={avatarUri} label="avatar" />
        </AvatarWrapper>
        <TextWrapper>
          <Typography weight="bold">{beautifiedName}</Typography>
        </TextWrapper>
      </LeadingSearchItem>
      {!isLoading && registrationStatus ? (
        <StatusTag status={registrationStatus} />
      ) : (
        <SpinnerWrapper>
          <Spinner color="accent" />
        </SpinnerWrapper>
      )}
    </SearchItemContainer>
  )
}

const EthResultItem = ({
  hoverCallback,
  clickCallback,
  index,
  selected,
  searchItem,
  usingPlaceholder,
}: SearchResultProps) => {
  const { text: name } = searchItem
  const { data: ensAvatar } = useEnsAvatar({
    ...ensAvatarConfig,
    name,
    query: { enabled: !usingPlaceholder },
  })
  const zorb = useZorb(name, 'name')
  const { registrationStatus, isLoading, beautifiedName } = useBasicName({
    name,
    enabled: !usingPlaceholder,
  })

  const { avatarUri, avatarIsPlaceholder } = getAvatarUri({ ensAvatar, usingPlaceholder, zorb })

  usePrefetchProfile({ name })

  return (
    <SearchItemContainer
      data-testid="search-result-name"
      onClick={() => clickCallback(index)}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => hoverCallback(index)}
      $clickable
      $selected={selected}
    >
      <LeadingSearchItem>
        <AvatarWrapper $isPlaceholder={avatarIsPlaceholder}>
          <Avatar src={avatarUri} label="avatar" />
        </AvatarWrapper>
        <TextWrapper>
          <Typography weight="bold">{beautifiedName}</Typography>
        </TextWrapper>
      </LeadingSearchItem>
      {!isLoading &&
      registrationStatus &&
      (registrationStatus !== 'invalid' || !usingPlaceholder) ? (
        <StatusTag status={registrationStatus} />
      ) : (
        <SpinnerWrapper>
          <Spinner color="accent" />
        </SpinnerWrapper>
      )}
    </SearchItemContainer>
  )
}

export const getBoxNameStatus = (isValidData: {
  isValid: boolean | undefined
  isAvailable: boolean | undefined
}) =>
  match(isValidData)
    .with({ isValid: false }, () => 'invalid' as const)
    .with({ isAvailable: true }, () => 'available' as const)
    .with({ isAvailable: false }, () => 'registered' as const)
    .otherwise(() => null)

const BoxResultItem = ({
  hoverCallback,
  clickCallback,
  index,
  selected,
  searchItem,
  usingPlaceholder,
}: SearchResultProps) => {
  const { text: name, isValid } = searchItem
  const { data: ensAvatar } = useEnsAvatar({
    ...ensAvatarConfig,
    name,
    query: { enabled: !usingPlaceholder },
  })
  const zorb = useZorb(usingPlaceholder ? 'placeholder' : name, 'name')
  const { data: isDotBoxAvailableOnchain, isLoading: isDotBoxAvailabilityLoading } =
    useDotBoxAvailabilityOnchain({ name, isValid, enabled: !usingPlaceholder })
  const isValidData = { isValid, isAvailable: isDotBoxAvailableOnchain }

  const status = getBoxNameStatus(isValidData)

  const { avatarUri, avatarIsPlaceholder } = getAvatarUri({ ensAvatar, usingPlaceholder, zorb })

  return (
    <SearchItemContainer
      data-testid="search-result-name"
      onClick={() => clickCallback(index)}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => hoverCallback(index)}
      $clickable={status !== 'invalid'}
      $selected={selected}
    >
      <LeadingSearchItem>
        <AvatarWrapper $isPlaceholder={avatarIsPlaceholder}>
          <Avatar src={avatarUri} label="avatar" />
        </AvatarWrapper>
        <TextWrapper>
          <Typography weight="bold">{name}</Typography>
        </TextWrapper>
      </LeadingSearchItem>
      {!isDotBoxAvailabilityLoading && status ? (
        <StatusTag status={status} />
      ) : (
        <SpinnerWrapper>
          <Spinner color="accent" />
        </SpinnerWrapper>
      )}
    </SearchItemContainer>
  )
}

export type SearchResultProps = {
  hoverCallback: (index: number) => void
  clickCallback: SearchHandler
  index: number
  selected: boolean
  searchItem: SearchItem
  usingPlaceholder: boolean
}

export const SearchResult = ({
  hoverCallback,
  clickCallback,
  index,
  selected,
  searchItem,
  usingPlaceholder,
}: SearchResultProps) =>
  match(searchItem)
    .with({ nameType: 'error' }, ({ text }) => (
      <SearchItemContainer data-testid="search-result-error" $selected $error>
        <Typography weight="bold">{text}</Typography>
      </SearchItemContainer>
    ))
    .with({ nameType: 'address' }, () => (
      <AddressResultItem
        {...{
          selected,
          hoverCallback,
          index,
          clickCallback,
          searchItem,
          usingPlaceholder,
        }}
      />
    ))
    .with(
      P.when(({ nameType }) => nameType === 'eth' || nameType === 'dns'),
      () => (
        <EthResultItem
          {...{
            selected,
            hoverCallback,
            index,
            clickCallback,
            searchItem,
            usingPlaceholder,
          }}
        />
      ),
    )
    .with({ nameType: 'box' }, () => (
      <BoxResultItem
        {...{ selected, hoverCallback, index, clickCallback, searchItem, usingPlaceholder }}
      />
    ))
    .with({ nameType: 'tld' }, () => (
      <TldResultItem
        {...{ selected, hoverCallback, index, clickCallback, searchItem, usingPlaceholder }}
      />
    ))
    .otherwise(() => (
      <SearchItemContainer data-testid="search-result-text">
        <NoInputYetTypography weight="bold">{searchItem.text}</NoInputYetTypography>
      </SearchItemContainer>
    ))
