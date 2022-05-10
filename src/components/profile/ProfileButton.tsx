import {
  addressIconTypes,
  DynamicAddressIcon,
} from '@app/assets/address/DynamicAddressIcon'
import {
  DynamicSocialIcon,
  socialIconTypes,
} from '@app/assets/social/DynamicSocialIcon'
import { useCopied } from '@app/hooks/useCopied'
import { getSocialData } from '@app/utils/getSocialData'
import { shortenAddress } from '@app/utils/utils'
import { ArrowUpSVG, Button, Space, Typography } from '@ensdomains/thorin'
import React from 'react'
import styled, { useTheme } from 'styled-components'
import { ConditionalWrapper } from '../ConditionalWrapper'
import { IconCopyAnimated } from '../IconCopyAnimated'

const Container = styled.div`
  ${({ theme }) => `
  padding: 0 ${theme.space['1']};
  width: 100%:
  `}
`

const Wrapper = styled.div`
  ${({ theme }) => `
  display: flex;
  flex-direction: row;
  flex-gap: ${theme.space['2']};
  gap: ${theme.space['2']};
  align-items: center;
  justify-content: center;
  `}
`

const StyledAddressIcon = styled(DynamicAddressIcon)`
  ${({ theme }) => `
  width: ${theme.space['5']};
  height: ${theme.space['5']};
  `}
`

const PrimaryText = styled(Typography)`
  ${({ theme }) => `
  color: ${theme.colors.text};
  `}
`

const RotatedIconArrowUp = styled.svg`
  ${({ theme }) => `
  display: block;
  transform: rotate(45deg);
  height: ${theme.space['3.5']};
  width: ${theme.space['3.5']};
  stroke-width: ${theme.borderWidths['1']};
  color: ${theme.colors.textTertiary};
  `}
`

const ProfileButton = ({
  prefixSize = '4',
  prefix,
  children,
  link,
  value,
  testid,
}: {
  prefixSize?: Space
  prefix?: React.ReactNode
  children: React.ReactNode
  link?: string
  value: string
  testid?: string
}) => {
  const { space } = useTheme()
  const { copy, copied } = useCopied()

  return (
    <ConditionalWrapper
      condition={link}
      wrapper={(wrapperChildren) => <a href={link}>{wrapperChildren}</a>}
    >
      <Button
        onClick={link ? undefined : () => copy(value)}
        size="extraSmall"
        shape="circle"
        variant="secondary"
        shadowless
      >
        <Container data-testid={testid}>
          <Wrapper>
            <div
              data-testid="found"
              style={{
                width: space[prefixSize],
                height: space[prefixSize],
              }}
            >
              {prefix}
            </div>
            <PrimaryText>{children}</PrimaryText>
            {link ? (
              <RotatedIconArrowUp as={ArrowUpSVG} key={link} />
            ) : (
              <IconCopyAnimated
                key={value}
                copied={copied}
                size="3"
                color="textTertiary"
              />
            )}
          </Wrapper>
        </Container>
      </Button>
    </ConditionalWrapper>
  )
}

export const SocialProfileButton = ({
  iconKey,
  value,
}: {
  iconKey: string
  value: string
}) => {
  const socialData = getSocialData(iconKey, value)

  return socialData ? (
    <ProfileButton
      prefixSize="4"
      prefix={
        <DynamicSocialIcon
          fill={socialData.color}
          name={socialData.icon as keyof typeof socialIconTypes}
        />
      }
      value={socialData.value}
      link={socialData.type === 'link' ? socialData.urlFormatter : undefined}
    >
      {socialData.value}
    </ProfileButton>
  ) : null
}

export const AddressProfileButton = ({
  iconKey: _iconKey,
  value,
}: {
  iconKey: string
  value: string
}) => {
  const iconKey = _iconKey.toLowerCase()

  return addressIconTypes[iconKey as keyof typeof addressIconTypes] ? (
    <ProfileButton
      testid={`address-profile-button-${iconKey}`}
      prefixSize="5"
      prefix={
        <StyledAddressIcon name={iconKey as keyof typeof addressIconTypes} />
      }
      value={value}
    >
      {shortenAddress(value)}
    </ProfileButton>
  ) : null
}

const OtherContainer = styled.div`
  ${({ theme }) => `
  background-color: ${theme.colors.textTertiary};
  padding: ${theme.space['0.25']} ${theme.space['1.5']};
  border-radius: ${theme.radii.large};
  `}
`

const OtherContainerAddressPrefix = styled(Typography)`
  ${({ theme }) => `
  color: ${theme.colors.white};
  `}
`

export const OtherProfileButton = ({
  iconKey,
  value,
  type = 'text',
}: {
  iconKey: string
  value: string
  type?: 'text' | 'address'
}) => {
  const isLink = value.startsWith('http://') || value.startsWith('https://')

  return (
    <ProfileButton
      link={isLink ? value : undefined}
      value={value}
      prefixSize="max"
      prefix={
        type === 'address' ? (
          <OtherContainer>
            <OtherContainerAddressPrefix variant="label">
              {iconKey}
            </OtherContainerAddressPrefix>
          </OtherContainer>
        ) : (
          <Typography color="textSecondary">{iconKey}</Typography>
        )
      }
    >
      {value.length > 15 ? `${value.slice(0, 15)}...` : value}
    </ProfileButton>
  )
}
