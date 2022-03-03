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
import {
  Box,
  BoxProps,
  Button,
  IconArrowUp,
  Stack,
  Typography,
} from '@ensdomains/thorin'
import React from 'react'
import styled from 'styled-components'
import { ConditionalWrapper } from '../ConditionalWrapper'
import { IconCopyAnimated } from '../IconCopyAnimated'

const RotatedIconArrowUp = styled(Box)`
  transform: rotate(45deg);
`

const ProfileButton = ({
  prefixSize = '4',
  prefix,
  children,
  link,
  value,
}: {
  prefixSize?: BoxProps['height']
  prefix?: React.ReactNode
  children: React.ReactNode
  link?: string
  value: string
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
        <Box paddingX="1" paddingY="0" width="full">
          <Stack
            direction="horizontal"
            space="2"
            justify="center"
            align="center"
          >
            <Box width={prefixSize} height={prefixSize}>
              {prefix}
            </Box>
            <Typography color="textPrimary">{children}</Typography>
            {link ? (
              <RotatedIconArrowUp
                key={link}
                size="3.5"
                strokeWidth="1"
                color="textTertiary"
                as={IconArrowUp}
              />
            ) : (
              <IconCopyAnimated
                key={value}
                copied={copied}
                size="3"
                color="textTertiary"
              />
            )}
          </Stack>
        </Box>
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
      prefixSize="5"
      prefix={
        <Box
          width="5"
          height="5"
          as={DynamicAddressIcon}
          name={iconKey as keyof typeof addressIconTypes}
        />
      }
      value={value}
    >
      {shortenAddress(value)}
    </ProfileButton>
  ) : null
}

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
          <Box
            backgroundColor="textTertiary"
            paddingX="1.5"
            paddingY="0.25"
            borderRadius="large"
          >
            <Typography color="white" size="label">
              {iconKey}
            </Typography>
          </Box>
        ) : (
          <Typography color="textSecondary">{iconKey}</Typography>
        )
      }
    >
      {value.length > 15 ? `${value.slice(0, 15)}...` : value}
    </ProfileButton>
  )
}
