import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCopyToClipboard } from 'react-use'
import styled, { css } from 'styled-components'
import { Address, isAddress } from 'viem'
import { useChainId } from 'wagmi'

import { getProtocolType } from '@ensdomains/ensjs/utils'
import {
  CopySVG,
  Dropdown,
  RecordItem,
  Typography,
  UpRightArrowSVG,
  VerticalDotsSVG,
} from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import { DynamicAddressIcon } from '@app/assets/address/DynamicAddressIcon'
import { dynamicAddressIcons } from '@app/assets/address/dynamicAddressIcons'
import { DynamicSocialIcon, socialIconTypes } from '@app/assets/social/DynamicSocialIcon'
import { DynamicVerificationIcon } from '@app/assets/verification/DynamicVerificationIcon'
import { VerificationBadgeAccountTooltipContent } from '@app/components/@molecules/VerificationBadge/components/VerificationBadgeAccountTooltipContent'
import { VerificationBadgeVerifierTooltipContent } from '@app/components/@molecules/VerificationBadge/components/VerificationBadgeVerifierTooltipContent'
import { VerificationBadge } from '@app/components/@molecules/VerificationBadge/VerificationBadge'
import { useCoinChain } from '@app/hooks/chain/useCoinChain'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { getDestination } from '@app/routes'
import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { getContentHashLink } from '@app/utils/contenthash'
import { getSocialData } from '@app/utils/getSocialData'
import { makeEtherscanLink, shortenAddress } from '@app/utils/utils'
import { getVerifierData } from '@app/utils/verification/getVerifierData'
import { isVerificationProtocol } from '@app/utils/verification/isVerificationProtocol'

const StyledAddressIcon = styled(DynamicAddressIcon)(
  ({ theme }) => css`
    width: ${theme.space['5']};
    height: ${theme.space['5']};
  `,
)

export const SocialProfileButton = ({
  iconKey,
  value,
  normalisedKey,
  isVerified,
  verifiers,
}: {
  iconKey: string
  normalisedKey: string
  value: string
  isVerified?: boolean
  verifiers?: VerificationProtocol[]
}) => {
  const breakpoints = useBreakpoint()
  const socialData = getSocialData(normalisedKey, value)

  if (!socialData) return null
  return (
    <VerificationBadge
      isVerified={isVerified}
      showBadge={isVerified}
      type="record"
      tooltipContent={<VerificationBadgeAccountTooltipContent verifiers={verifiers} />}
    >
      <RecordItem
        icon={() => (
          <DynamicSocialIcon
            height={20}
            width={20}
            fill={socialData.color}
            name={socialData.icon as keyof typeof socialIconTypes}
          />
        )}
        size={breakpoints.sm ? 'large' : 'small'}
        inline
        data-testid={`social-profile-button-${iconKey}`}
        value={socialData.value}
        {...(socialData.type === 'link'
          ? { as: 'a' as const, link: socialData.urlFormatter }
          : { as: 'button' as const })}
      >
        {socialData.value}
      </RecordItem>
    </VerificationBadge>
  )
}

export const AddressProfileButton = ({
  iconKey: _iconKey,
  value: address,
}: {
  iconKey: string
  value: string
}) => {
  const breakpoints = useBreakpoint()
  const iconKey = _iconKey.toLowerCase()

  const [, copy] = useCopyToClipboard()
  const coinChainResults = useCoinChain({ coinName: iconKey })
  const { data } = coinChainResults
  const defaultBlockExplorer = data?.blockExplorers?.default

  const items = [
    iconKey === 'eth'
      ? {
          icon: UpRightArrowSVG,
          label: 'View address',
          href: getDestination(`/${address}`) as string,
        }
      : undefined,
    {
      icon: CopySVG,
      label: 'Copy address',
      onClick: () => copy(address),
    },
    defaultBlockExplorer
      ? {
          icon: UpRightArrowSVG,
          label: `View on ${defaultBlockExplorer?.name}`,
          href: `${defaultBlockExplorer?.url}/address/${address}`,
        }
      : undefined,
  ].filter((item) => item !== undefined) as DropdownItem[]

  return iconKey in dynamicAddressIcons ? (
    <Dropdown width={200} items={items} direction="up">
      <RecordItem
        data-testid={`address-profile-button-${iconKey}`}
        postfixIcon={VerticalDotsSVG}
        icon={() => <StyledAddressIcon name={iconKey} />}
        value={address}
        size={breakpoints.sm ? 'large' : 'small'}
        inline
      >
        {shortenAddress(
          address,
          undefined,
          breakpoints.sm ? undefined : 4,
          breakpoints.sm ? undefined : 3,
        )}
      </RecordItem>
    </Dropdown>
  ) : null
}

const OtherContainer = styled.div(
  ({ theme }) => css`
    background-color: ${theme.colors.greyPrimary};
    padding: 0 ${theme.space['1.25']};
    border-radius: ${theme.radii.checkbox};
    height: ${theme.space['5']};
    display: flex;
    align-items: center;
  `,
)

const OtherContainerAddressPrefix = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.backgroundPrimary};
    font-size: ${theme.fontSizes.extraSmall};
  `,
)

const OtherContainerTextPrefix = styled(Typography)(
  ({ theme }) => css`
    padding-left: ${theme.space['0.5']};
  `,
)

export const OtherProfileButton = ({
  iconKey,
  value,
  type = 'text',
  name,
}: {
  iconKey: string
  value: string
  type?: 'text' | 'address' | 'contenthash'
  name: string
}) => {
  const chainId = useChainId()
  const breakpoints = useBreakpoint()
  const isLink =
    value?.startsWith('http://') || value?.startsWith('https://') || type === 'contenthash'

  const formattedValue = useMemo(() => {
    if (breakpoints.sm) {
      if (type === 'address') {
        return shortenAddress(value)
      }
      return value?.length > 15 ? `${value.slice(0, 15)}...` : value
    }
    return value?.length > 5 ? `${value.slice(0, 5)}...` : value
  }, [type, value, breakpoints])

  const linkProps = useMemo(() => {
    if (!isLink) return {}
    if (type === 'contenthash') {
      const decodedContentHash = getProtocolType(value)
      if (!decodedContentHash) return {}
      const _link = getContentHashLink({ name, chainId, decodedContentHash })
      if (!_link) return {}
      return {
        as: 'a',
        link: _link,
      } as const
    }
    return {
      as: 'a',
      link: value,
    } as const
  }, [isLink, type, value, name, chainId])

  return (
    <RecordItem
      {...linkProps}
      value={value}
      inline
      size={breakpoints.sm ? 'large' : 'small'}
      keyLabel={
        type === 'address' ? (
          <OtherContainer>
            <OtherContainerAddressPrefix fontVariant="extraSmall">
              {iconKey}
            </OtherContainerAddressPrefix>
          </OtherContainer>
        ) : (
          <OtherContainerTextPrefix color="grey">{iconKey}</OtherContainerTextPrefix>
        )
      }
      data-testid={`other-profile-button-${iconKey}`}
    >
      {formattedValue}
    </RecordItem>
  )
}

export const OwnerProfileButton = ({
  iconKey: label,
  value: addressOrNameOrDate,
  timestamp,
}: {
  iconKey: string
  value: string
  timestamp?: number
}) => {
  const { t } = useTranslation('common')
  const breakpoints = useBreakpoint()

  const dataType = useMemo(() => {
    if (!addressOrNameOrDate)
      // eslint-disable-next-line no-nested-ternary
      return label === 'name.expiry'
        ? 'noExpiry'
        : label === 'name.parent'
        ? 'noParent'
        : 'notOwned'
    if (label === 'name.expiry') return 'expiry'
    if (isAddress(addressOrNameOrDate)) return 'address'
    const isTLD = addressOrNameOrDate.split('.').length === 1
    return isTLD ? 'tld' : 'name'
  }, [addressOrNameOrDate, label])

  const primary = usePrimaryName({
    address: addressOrNameOrDate as Address,
    enabled: dataType === 'address',
  })

  const { link, ...recordItemPartialProps } = useMemo(() => {
    const base = {
      keyLabel: t(label).toLocaleLowerCase(),
      value: addressOrNameOrDate,
      target: undefined,
      as: 'button',
    } as const
    if (dataType === 'expiry')
      return {
        ...base,
        link: undefined,
        children: addressOrNameOrDate,
      } as const
    if (dataType === 'noExpiry')
      return {
        ...base,
        link: undefined,
        children: t('name.noExpiry').toLocaleLowerCase(),
      } as const
    if (dataType === 'notOwned')
      return {
        ...base,
        link: undefined,
        children: t('name.notOwned').toLocaleLowerCase(),
      } as const
    if (dataType === 'noParent')
      return { ...base, link: undefined, children: t('name.noParent').toLocaleLowerCase() }
    if (dataType === 'address')
      return {
        ...base,
        link: primary.data?.name
          ? (getDestination(`/profile/${primary.data?.name}`) as string)
          : (getDestination(`/address/${addressOrNameOrDate}`) as string),
        children:
          primary.data?.beautifiedName ||
          (breakpoints.sm ? shortenAddress(addressOrNameOrDate) : addressOrNameOrDate.slice(0, 5)),
      } as const
    return {
      ...base,
      link: getDestination(`/profile/${addressOrNameOrDate}`) as string,
      children: addressOrNameOrDate,
    } as const
  }, [
    dataType,
    addressOrNameOrDate,
    label,
    breakpoints,
    primary.data?.name,
    primary.data?.beautifiedName,
    t,
  ])

  const [, copy] = useCopyToClipboard()

  const items = [
    link
      ? {
          icon: UpRightArrowSVG,
          label: 'View profile',
          href: link,
        }
      : undefined,
    primary.data?.name
      ? {
          icon: CopySVG,
          label: 'Copy name',
          onClick: () => copy(primary.data?.name!),
        }
      : undefined,
    ...(dataType === 'address'
      ? ([
          {
            icon: UpRightArrowSVG,
            label: 'View address',
            href: getDestination(`/${addressOrNameOrDate}`) as string,
          },
          {
            icon: CopySVG,
            label: 'Copy address',
            onClick: () => copy(addressOrNameOrDate),
          },
          {
            icon: UpRightArrowSVG,
            label: 'View on Etherscan',
            href: makeEtherscanLink(addressOrNameOrDate, 'mainnet', 'address'),
          },
        ] as DropdownItem[])
      : []),
  ].filter((item) => item !== undefined) as DropdownItem[]

  if (dataType === 'expiry') {
    return (
      <RecordItem
        {...recordItemPartialProps}
        data-testid={`owner-profile-button-${label}`}
        data-timestamp={timestamp}
        inline
        size={breakpoints.sm ? 'large' : 'small'}
      />
    )
  }
  return (
    <Dropdown width={200} items={items} direction="up">
      <RecordItem
        {...recordItemPartialProps}
        postfixIcon={VerticalDotsSVG}
        data-testid={`owner-profile-button-${label}`}
        data-timestamp={timestamp}
        inline
        size={breakpoints.sm ? 'large' : 'small'}
      />
    </Dropdown>
  )
}

export const VerificationProfileButton = ({
  iconKey,
  value,
  isVerified,
  showBadge,
}: {
  iconKey: string
  value: string
  isVerified?: boolean
  showBadge?: boolean
}) => {
  const breakpoints = useBreakpoint()

  if (!isVerificationProtocol(iconKey)) return null

  const verificationData = getVerifierData(iconKey, value)

  return verificationData ? (
    <VerificationBadge
      showBadge={showBadge}
      isVerified={isVerified}
      type="personhood"
      tooltipContent={<VerificationBadgeVerifierTooltipContent isVerified={!!isVerified} />}
    >
      <RecordItem
        icon={() => <DynamicVerificationIcon name={iconKey} />}
        size={breakpoints.sm ? 'large' : 'small'}
        inline
        data-testid={`verification-profile-button-${iconKey}`}
        value={verificationData.value}
        as="a"
        link={verificationData.urlFormatter}
      >
        {verificationData.label}
      </RecordItem>
    </VerificationBadge>
  ) : null
}
