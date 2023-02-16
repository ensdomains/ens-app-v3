import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { RecordItem, Typography } from '@ensdomains/thorin'

import { DynamicAddressIcon, addressIconTypes } from '@app/assets/address/DynamicAddressIcon'
import { DynamicSocialIcon, socialIconTypes } from '@app/assets/social/DynamicSocialIcon'
import { usePrimary } from '@app/hooks/usePrimary'
import { getDestination } from '@app/routes'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { getSocialData } from '@app/utils/getSocialData'
import { shortenAddress } from '@app/utils/utils'

const StyledAddressIcon = styled(DynamicAddressIcon)(
  ({ theme }) => css`
    width: ${theme.space['5']};
    height: ${theme.space['5']};
  `,
)

export const SocialProfileButton = ({ iconKey, value }: { iconKey: string; value: string }) => {
  const breakpoints = useBreakpoint()
  const socialData = getSocialData(iconKey, value)

  return socialData ? (
    <RecordItem
      icon={
        <DynamicSocialIcon
          fill={socialData.color}
          name={socialData.icon as keyof typeof socialIconTypes}
        />
      }
      size={breakpoints.md ? 'large' : 'small'}
      inline
      data-testid={`social-profile-button-${iconKey}`}
      value={socialData.value}
      link={socialData.type === 'link' ? socialData.urlFormatter : undefined}
    >
      {socialData.value}
    </RecordItem>
  ) : null
}

export const AddressProfileButton = ({
  iconKey: _iconKey,
  value,
}: {
  iconKey: string
  value: string
}) => {
  const breakpoints = useBreakpoint()
  const iconKey = _iconKey.toLowerCase()

  return addressIconTypes[iconKey as keyof typeof addressIconTypes] ? (
    <RecordItem
      data-testid={`address-profile-button-${iconKey}`}
      icon={<StyledAddressIcon name={iconKey as keyof typeof addressIconTypes} />}
      value={value}
      size={breakpoints.md ? 'large' : 'small'}
      inline
    >
      {shortenAddress(
        value,
        undefined,
        breakpoints.sm ? undefined : 4,
        breakpoints.sm ? undefined : 3,
      )}
    </RecordItem>
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
}: {
  iconKey: string
  value: string
  type?: 'text' | 'address'
}) => {
  const breakpoints = useBreakpoint()
  const isLink = value?.startsWith('http://') || value?.startsWith('https://')

  const formattedValue = useMemo(() => {
    if (breakpoints.sm) {
      if (type === 'address') {
        return shortenAddress(value)
      }
      return value?.length > 15 ? `${value.slice(0, 15)}...` : value
    }
    return value?.length > 5 ? `${value.slice(0, 5)}...` : value
  }, [type, value, breakpoints])

  return (
    <RecordItem
      link={isLink ? value : undefined}
      value={value}
      inline
      size={breakpoints.md ? 'large' : 'small'}
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
  value: address,
  timestamp,
}: {
  iconKey: string
  value: string
  timestamp?: number
}) => {
  const { t } = useTranslation('common')
  const breakpoints = useBreakpoint()
  const { name: primary } = usePrimary(address, address === '')

  const formattedAddress = useMemo(() => {
    if (breakpoints.sm) {
      return shortenAddress(address)
    }
    return `${address.slice(0, 5)}...`
  }, [address, breakpoints])

  const isExpiry = label === 'expiry'
  const isNotOwned = !isExpiry && address === ''

  const value = useMemo(() => {
    if (isExpiry) {
      return address
    }
    if (isNotOwned) {
      return t('name.notOwned').toLocaleLowerCase()
    }
    return primary || formattedAddress
  }, [address, formattedAddress, isExpiry, isNotOwned, primary, t])

  return (
    <RecordItem
      link={isExpiry || isNotOwned ? undefined : (getDestination(`/address/${address}`) as string)}
      value={address}
      keyLabel={
        <OtherContainerTextPrefix color="textSecondary">
          {t(label).toLocaleLowerCase()}
        </OtherContainerTextPrefix>
      }
      data-testid={`owner-profile-button-${label}`}
      data-timestamp={isExpiry ? timestamp : undefined}
      inline
      size={breakpoints.md ? 'large' : 'small'}
    >
      {value}
    </RecordItem>
  )
}
