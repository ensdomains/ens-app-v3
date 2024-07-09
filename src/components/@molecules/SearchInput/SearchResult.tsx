/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/interactive-supports-focus */
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'
import { useEnsAvatar } from 'wagmi'

import { Avatar, Spinner, Tag, Typography } from '@ensdomains/thorin'

import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useBasicName } from '@app/hooks/useBasicName'
import { useBeautifiedName } from '@app/hooks/useBeautifiedName'
import { usePrefetchProfile } from '@app/hooks/useProfile'
import { useZorb } from '@app/hooks/useZorb'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import type { RegistrationStatus } from '@app/utils/registrationStatus'
import { shortenAddress } from '@app/utils/utils'

const SearchItem = styled.div<{
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
    border-bottom: ${theme.borderWidths['0.375']} ${theme.borderStyles.solid} ${theme.colors.border};
    &:last-of-type {
      border-bottom: 0;
    }
    position: relative;
    opacity: 0.6;
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
    color: ${theme.colors.textTertiary};
  `,
)

const AvatarWrapper = styled.div<{ $isPlaceholder?: boolean }>(
  ({ theme, $isPlaceholder }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${theme.space['8']};
    min-width: ${theme.space['8']};
    height: ${theme.space['8']};
    flex-grow: 1;
    ${$isPlaceholder &&
    css`
      filter: grayscale(100%);
    `}
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
    border: ${theme.borderWidths['0.375']} solid ${theme.colors.border};
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

const AddressResultItem = ({ address }: { address: Address }) => {
  const { t } = useTranslation('common')
  const { data: primaryName } = usePrimaryName({ address })
  const { data: avatar } = useEnsAvatar({ name: primaryName?.name })
  const zorb = useZorb(address, 'address')

  return (
    <>
      <LeadingSearchItem>
        <AvatarWrapper>
          <Avatar src={avatar || zorb} label="avatar" />
        </AvatarWrapper>
        <AddressAndName>
          <Typography weight="bold">{shortenAddress(address, undefined, 8, 6)}</Typography>
          {primaryName?.name && <AddressPrimary>{primaryName?.beautifiedName}</AddressPrimary>}
        </AddressAndName>
      </LeadingSearchItem>
      <AddressTag>{t('address.label')}</AddressTag>
    </>
  )
}

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
    case 'notImported':
      return <StyledTag colorStyle="blueSecondary">{t(`search.status.${status}`)}</StyledTag>
    case 'short':
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
      direction: rtl;
      &::before {
        content: '‎';
      }
    }
  `,
)

const PlaceholderResultItem = ({ input }: { input: string }) => {
  const zorb = useZorb('placeholder', 'name')
  const beautifiedName = useBeautifiedName(input)

  return (
    <>
      <LeadingSearchItem>
        <AvatarWrapper $isPlaceholder>
          <Avatar src={zorb} label="name" />
        </AvatarWrapper>
        <TextWrapper>
          <Typography weight="bold">{beautifiedName}</Typography>
        </TextWrapper>
      </LeadingSearchItem>
      <SpinnerWrapper>
        <Spinner color="accent" />
      </SpinnerWrapper>
    </>
  )
}

const NameResultItem = forwardRef<HTMLDivElement, { name: string; $selected: boolean }>(
  ({ name, ...props }, ref) => {
    const { data: avatar } = useEnsAvatar({ ...ensAvatarConfig, name })
    const zorb = useZorb(name, 'name')
    const { registrationStatus, isLoading, beautifiedName } = useBasicName({ name })

    usePrefetchProfile({ name })

    return (
      <SearchItem
        data-testid="search-result-name"
        {...props}
        $clickable={registrationStatus !== 'short'}
        ref={ref}
      >
        <LeadingSearchItem>
          <AvatarWrapper>
            <Avatar src={avatar || zorb} label="name" />
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
      </SearchItem>
    )
  },
)

type SearchItemType = 'text' | 'error' | 'address' | 'name' | 'nameWithDotEth'

export const SearchResult = ({
  type,
  value,
  hoverCallback,
  clickCallback,
  index,
  selected,
  usingPlaceholder = true,
}: {
  type: SearchItemType
  value: string
  hoverCallback: (index: number) => void
  clickCallback: (index: number) => void
  index: number
  selected: number
  usingPlaceholder?: boolean
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: MouseEvent) => e.preventDefault()

  const handleClick = useCallback(() => {
    clickCallback(index)
  }, [index, clickCallback])

  useEffect(() => {
    const wrapper = wrapperRef.current
    wrapper?.addEventListener('mousedown', handleMouseDown)
    wrapper?.addEventListener('click', handleClick)
    return () => {
      wrapper?.removeEventListener('mousedown', handleMouseDown)
      wrapper?.removeEventListener('click', handleClick)
    }
  }, [handleClick])

  const input = useMemo(() => {
    if (type === 'nameWithDotEth') {
      return `${value!}.lyx`
    }
    return value
  }, [type, value])

  const props = useMemo(
    () => ({
      ref: wrapperRef,
      onMouseEnter: () => hoverCallback(index),
      $selected: index === selected,
    }),
    [index, hoverCallback, selected],
  )

  if (usingPlaceholder && type !== 'error' && type !== 'text') {
    return (
      <SearchItem data-testid="search-result-placeholder" {...props}>
        <PlaceholderResultItem input={input} />
      </SearchItem>
    )
  }

  if (type === 'address') {
    return (
      <SearchItem data-testid="search-result-address" $clickable {...props}>
        <AddressResultItem address={input as Address} />
      </SearchItem>
    )
  }

  if (type === 'name' || type === 'nameWithDotEth') {
    return <NameResultItem name={input} {...props} />
  }

  if (type === 'error') {
    return (
      <SearchItem data-testid="search-result-error" $selected $error>
        <Typography weight="bold">{value}</Typography>
      </SearchItem>
    )
  }

  return (
    <SearchItem data-testid="search-result-text">
      <NoInputYetTypography weight="bold">{value}</NoInputYetTypography>
    </SearchItem>
  )
}
