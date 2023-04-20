import { ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Avatar, mq } from '@ensdomains/thorin'

import CircleTick from '@app/assets/CircleTick.svg'
import { useAvatar } from '@app/hooks/useAvatar'
import { useZorb } from '@app/hooks/useZorb'
import { checkETH2LDFromName } from '@app/utils/utils'

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
    transition: all 0.15s ease-in-out, border 0s;
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
    ${mq.sm.min(css`
      padding: ${theme.space['3']} ${theme.space['4.5']};
      gap: ${theme.space['4']};
    `)}
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
    min-width: 0;
    width: 0;
  `,
)

const TitleWrapper = styled(StyledName)(
  () => css`
    font-size: 1rem;
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
  network,
  mode,
  selected = false,
  disabled = false,
  onClick,
  children,
}: Name & {
  expiryDate?: Date
  network: number
  mode?: 'view' | 'select'
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}) => {
  const { avatar } = useAvatar(name, network)
  const zorb = useZorb(name, 'name')

  const handleClick = () => {
    if (disabled) return
    onClick?.()
  }

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
                <CircleTick />
              </AvatarOverlay>
            )}
          </AvatarWrapper>
          <NameItemContent>
            <TitleWrapper name={truncatedName || name} disabled={disabled} />
            {expiryDate && (
              <SubtitleWrapper>
                <ShortExpiry expiry={expiryDate} hasGracePeriod={checkETH2LDFromName(name)} />
              </SubtitleWrapper>
            )}
          </NameItemContent>
        </NameItemContainer>
        <div>{children}</div>
      </NameItemWrapper>
    </OptionalLink>
  )
}
