import { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { useEnsAvatar } from 'wagmi'

import { Avatar } from '@ensdomains/thorin'

import CircleTick from '@app/assets/CircleTick.svg'
import { useZorb } from '@app/hooks/useZorb'
import { INVALID_NAME } from '@app/utils/constants'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'
import { checkETH2LDFromName } from '@app/utils/utils'

import { safeDateObj } from '../../../utils/date'
import { ShortExpiry } from '../ExpiryComponents/ExpiryComponents'
import { OptionalLink } from '../OptionalLink/OptionalLink'
import { StyledName } from '../StyledName/StyledName'

const NameItemWrapper = styled.div<{ $highlight: boolean; $disabled: boolean }>(
  ({ theme, $highlight, $disabled }) => css`
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    overflow: hidden;
    padding: ${theme.space['3']} ${theme.space['4']};
    gap: ${theme.space['2']};
    border-bottom: 1px solid ${theme.colors.border};
    transition:
      all 0.15s ease-in-out,
      border 0s;
    background: ${$highlight ? theme.colors.blueSurface : theme.colors.backgroundPrimary};
    cursor: ${$disabled ? 'not-allowed' : 'pointer'};
    &:hover {
      background: ${$highlight
        ? theme.colors.backgroundSecondary
        : theme.colors.backgroundSecondary};
    }
    &:last-of-type {
      border: none;
    }
    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['3']} ${theme.space['4.5']};
      gap: ${theme.space['4']};
    }
  `,
)

const NameItemContainer = styled.div(
  ({ theme }) => css`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    min-width: 0;
    gap: ${theme.space['2']};
    flex-gap: 16px;
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    position: relative;
    width: ${theme.space['9']};
  `,
)

const NameItemContent = styled.div(
  () => css`
    flex: 1;
    display: flex;
    position: relative;
    flex-direction: column;
    overflow: hidden;
  `,
)

const SubtitleWrapper = styled.div(
  ({ theme }) => css`
    font-size: ${theme.space['3.5']};
    line-height: 1.43;
    color: ${theme.colors.greyPrimary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
)

const AvatarOverlay = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(82, 152, 255, 0.5);
    border-radius: ${theme.radii.full};
    svg {
      fill: transparent;
      path {
        stroke: ${theme.colors.backgroundPrimary};
        stroke-width: 1px;
      }
      rect {
        stroke: transparent;
      }
    }
  `,
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
  const { data: avatar } = useEnsAvatar({ ...ensAvatarConfig, name })
  const zorb = useZorb(name, 'name')

  const handleClick = () => {
    if (disabled) return
    onClick?.()
  }

  const _expiryDate = safeDateObj(expiryDate)

  return (
    <OptionalLink
      active={mode !== 'select' && name !== INVALID_NAME}
      href={`/profile/${name}`}
      passHref
    >
      <NameItemWrapper
        $disabled={name === INVALID_NAME || disabled}
        $highlight={mode === 'select' && selected}
        as={mode !== 'select' ? 'a' : 'div'}
        data-testid={`name-item-${name}`}
        className="name-detail-item"
        onClick={(e: any) => {
          if (mode === 'select' && name !== INVALID_NAME && !disabled) {
            e.preventDefault()
            e.stopPropagation()
            handleClick()
          }
        }}
      >
        <NameItemContainer>
          <AvatarWrapper
            data-testid={`name-item-avatar-wrapper-${name}`}
            onClick={(e: any) => {
              e.preventDefault()
              e.stopPropagation()
              if (name !== INVALID_NAME && !disabled) {
                handleClick()
              }
            }}
          >
            <Avatar
              placeholder={zorb}
              label={truncatedName || name}
              src={avatar || zorb}
              data-testid="name-detail-item-avatar"
              disabled={disabled}
            />
            {mode === 'select' && selected && (
              <AvatarOverlay>
                <CircleTick />
              </AvatarOverlay>
            )}
          </AvatarWrapper>
          <NameItemContent>
            <StyledName name={truncatedName || name} disabled={disabled} />
            {_expiryDate && (
              <SubtitleWrapper>
                <ShortExpiry expiry={_expiryDate} hasGracePeriod={checkETH2LDFromName(name)} />
              </SubtitleWrapper>
            )}
          </NameItemContent>
        </NameItemContainer>
        <div>{children}</div>
      </NameItemWrapper>
    </OptionalLink>
  )
}
