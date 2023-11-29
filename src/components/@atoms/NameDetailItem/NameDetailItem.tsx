import { ReactNode } from 'react'
import { useEnsAvatar } from 'wagmi'

import { Avatar, Box, BoxProps, cssVars } from '@ensdomains/thorin'

import NoCircleTick from '@app/assets/NoCircleTick.svg'
import { useZorb } from '@app/hooks/useZorb'
import { checkETH2LDFromName } from '@app/utils/utils'

import { safeDateObj } from '../../../utils/date'
import { ShortExpiry } from '../ExpiryComponents/ExpiryComponents'
import { OptionalLink } from '../OptionalLink/OptionalLink'
import { StyledName } from '../StyledName/StyledName'
import { nameDetailItem } from './style.css'

type NameItemWrapperProps = { $highlight: boolean; $disabled: boolean }
const NameItemWrapper = ({ $highlight, $disabled, ...props }: BoxProps & NameItemWrapperProps) => (
  <Box
    {...props}
    display="flex"
    className={nameDetailItem}
    flexDirection="row"
    flexWrap="wrap"
    justifyContent="space-between"
    alignItems="center"
    width="$full"
    overflow="hidden"
    px={{ base: '$4', sm: '$4.5' }}
    py="$3"
    gap={{ base: '$2', sm: '$4' }}
    borderBottom={`1px solid ${cssVars.color.border}`}
    transition="all 0.15s ease-in-out, border 0s;"
    backgroundColor={{
      base: $highlight ? cssVars.color.blueSurface : cssVars.color.background,
      hover: cssVars.color.backgroundSecondary,
    }}
    cursor={$disabled ? 'not-allowed' : 'pointer'}
  />
)

const NameItemContainer = (props: BoxProps) => (
  <Box
    {...props}
    flex="1"
    display="flex"
    alignItems="center"
    justifyContent="center"
    overflow="hidden"
    minWidth="0"
    gap="$2"
  />
)

const AvatarWrapper = (props: BoxProps) => (
  <Box {...props} position="relative" width="$9" flex={`0 0 ${cssVars.space['9']}`} />
)

const NameItemContent = (props: BoxProps) => (
  <Box
    {...props}
    flex="1"
    display="flex"
    position="relative"
    flexDirection="column"
    overflow="hidden"
    minWidth="$0"
  />
)

const AvatarOverlay = (props: BoxProps) => (
  <Box
    {...props}
    position="absolute"
    top="$0"
    left="$0"
    width="$full"
    height="$full"
    background="rgba(82, 152, 255, 0.5)"
    borderRadius="$full"
  />
)

type Name = {
  name: string
  truncatedName?: string
}

export const NameDetailItem = ({
  name,
  truncatedName,
  expiryDate,
  mode,
  selected = false,
  disabled = false,
  onClick,
  children,
}: Name & {
  expiryDate?: Date
  mode?: 'view' | 'select'
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}) => {
  const { data: avatar } = useEnsAvatar()
  const zorb = useZorb(name, 'name')

  const handleClick = () => {
    if (disabled) return
    onClick?.()
  }

  const _expiryDate = safeDateObj(expiryDate)

  return (
    <OptionalLink active={mode !== 'select'} href={`/profile/${name}`} passHref>
      <NameItemWrapper
        $disabled={disabled}
        $highlight={mode === 'select' && selected}
        as={mode !== 'select' ? 'a' : 'div'}
        data-testid={`name-item-${name}`}
        onClick={handleClick}
      >
        <NameItemContainer>
          <AvatarWrapper>
            <Avatar
              label={truncatedName || name}
              src={avatar || zorb}
              data-testid="name-detail-item-avatar"
              disabled={disabled}
            />
            {mode === 'select' && selected && (
              <AvatarOverlay>
                <Box as={<NoCircleTick />} fill="none" strokeWidth="1px" color="$background" />
              </AvatarOverlay>
            )}
          </AvatarWrapper>
          <NameItemContent>
            <StyledName name={truncatedName || name} disabled={disabled} fontSize="$body" />
            {_expiryDate && (
              <Box
                fontSize="$small"
                lineHeight="1.43"
                color="$textSecondary"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                <ShortExpiry expiry={_expiryDate} hasGracePeriod={checkETH2LDFromName(name)} />
              </Box>
            )}
          </NameItemContent>
        </NameItemContainer>
        <div>{children}</div>
      </NameItemWrapper>
    </OptionalLink>
  )
}
