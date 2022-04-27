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
import { ArrowUpSVG, Button, tokens, Typography } from '@ensdomains/thorin'
import React from 'react'
import styled from 'styled-components'
import { ConditionalWrapper } from '../ConditionalWrapper'
import { IconCopyAnimated } from '../IconCopyAnimated'

const Container = styled.div`
  padding: 0 ${tokens.space['1']};
  width: 100%:
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-gap: ${tokens.space['2']};
  gap: ${tokens.space['2']};
  align-items: center;
  justify-content: center;
`

const StyledAddressIcon = styled(DynamicAddressIcon)`
  width: ${tokens.space['5']};
  height: ${tokens.space['5']};
`

const PrimaryText = styled(Typography)`
  color: ${({ theme }) => tokens.colors[theme.mode].text};
`

const RotatedIconArrowUp = styled.svg`
  display: block;
  transform: rotate(45deg);
  height: ${tokens.space['3.5']};
  width: ${tokens.space['3.5']};
  stroke-width: ${tokens.borderWidths['1']};
  color: ${({ theme }) => tokens.colors[theme.mode].textTertiary};
`

const ProfileButton = ({
  prefixSize = '4',
  prefix,
  children,
  link,
  value,
  testid,
}: {
  prefixSize?: keyof typeof tokens.space
  prefix?: React.ReactNode
  children: React.ReactNode
  link?: string
  value: string
  testid?: string
}) => {
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
                width: tokens.space[prefixSize],
                height: tokens.space[prefixSize],
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
  background-color: ${({ theme }) => tokens.colors[theme.mode].textTertiary};
  padding: ${tokens.space['0.25']} ${tokens.space['1.5']};
  border-radius: ${tokens.radii.large};
`

const OtherContainerAddressPrefix = styled(Typography)`
  color: ${tokens.colors.base.white};
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
