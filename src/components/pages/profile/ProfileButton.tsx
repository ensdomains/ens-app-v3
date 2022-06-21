import React, { useMemo } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { ArrowUpSVG, Button, Space, Typography, mq } from '@ensdomains/thorin'

import {
  addressIconTypes,
  DynamicAddressIcon,
} from '@app/assets/address/DynamicAddressIcon'
import {
  DynamicSocialIcon,
  socialIconTypes,
} from '@app/assets/social/DynamicSocialIcon'
import { useCopied } from '@app/hooks/useCopied'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { getSocialData } from '@app/utils/getSocialData'
import { shortenAddress } from '@app/utils/utils'
import { ConditionalWrapper } from '@app/components/ConditionalWrapper'
import { IconCopyAnimated } from '@app/components/IconCopyAnimated'

const Container = styled.div(
  ({ theme }) => css`
    padding: 0;
    padding-right: ${theme.space['0.25']};
    width: 100%;
    ${mq.md.min(css`
      padding: 0 ${theme.space['1']};
    `)}
  `,
)

const Wrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    flex-gap: ${theme.space['2']};
    gap: ${theme.space['2']};
    align-items: center;
    justify-content: center;
  `,
)

const StyledAddressIcon = styled(DynamicAddressIcon)(
  ({ theme }) => css`
    width: ${theme.space['5']};
    height: ${theme.space['5']};
  `,
)

const PrimaryText = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.text};
  `,
)

const RotatedIconArrowUp = styled.svg(
  ({ theme }) => css`
    display: block;
    transform: rotate(45deg);
    height: ${theme.space['3.5']};
    width: ${theme.space['3.5']};
    stroke-width: ${theme.borderWidths['1']};
    color: ${theme.colors.textTertiary};
  `,
)

const MinWidthWrapper = styled.div(
  () => css`
    width: min-content;
  `,
)

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
      <MinWidthWrapper>
        <Button
          onClick={link ? undefined : () => copy(value)}
          size="extraSmall"
          shape="circle"
          variant="primary"
          tone="grey"
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
      </MinWidthWrapper>
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
  const breakpoints = useBreakpoint()
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
      {shortenAddress(
        value,
        undefined,
        breakpoints.sm ? undefined : 4,
        breakpoints.sm ? undefined : 3,
      )}
    </ProfileButton>
  ) : null
}

const OtherContainer = styled.div(
  ({ theme }) => css`
    background-color: ${theme.colors.textTertiary};
    padding: ${theme.space['0.5']} ${theme.space['1.25']};
    border-radius: ${theme.radii.large};
  `,
)

const OtherContainerAddressPrefix = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.white};
    font-size: ${theme.fontSizes.label};
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
          <OtherContainerTextPrefix color="textSecondary">
            {iconKey}
          </OtherContainerTextPrefix>
        )
      }
    >
      {formattedValue}
    </ProfileButton>
  )
}
