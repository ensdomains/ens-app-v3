import { useMemo, ReactNode } from 'react'
import { useAvatar } from '@app/hooks/useAvatar'
import { useExpiry } from '@app/hooks/useExpiry'
import { useZorb } from '@app/hooks/useZorb'
import { Avatar, mq } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import CircleTick from '@app/assets/CircleTick.svg'
import { ShortExpiry } from '../ExpiryComponents/ExpiryComponents'
import { StyledName } from '../StyledName/StyledName'
import { OptionalLink } from '../OptionalLink/OptionalLink'

const NameItemWrapper = styled.div<{ $highlight: boolean }>(
  ({ theme, $highlight }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    overflow: hidden;
    padding: ${theme.space['3']} ${theme.space['4']};
    gap: ${theme.space['2']};
    border-bottom: 1px solid ${theme.colors.borderTertiary};
    transition: all 0.15s ease-in-out;
    background: ${$highlight ? theme.colors.accentSecondary : theme.colors.white};
    cursor: pointer;
    &:hover {
      background: ${$highlight ? theme.colors.accentTertiary : theme.colors.backgroundSecondary};
    }
    &:last-of-type {
      border: none;
    }
    ${mq.md.min(css`
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
    ${mq.md.min(css``)}
  `,
)

const SubtitleWrapper = styled.div(
  ({ theme }) => css`
    font-size: ${theme.space['3.5']};
    line-height: 1.43;
    color: ${theme.colors.textTertiary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
)

const DetailsContainer = styled.div(() => css``)

const AvatarOverlay = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(82, 152, 255, 0.75);
    border-radius: ${theme.radii.full};
    svg {
      path {
        stroke: ${theme.colors.white};
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
  network,
  mode,
  selected = false,
  onClick,
  children,
}: Name & {
  network: number
  mode?: 'view' | 'select'
  selected?: boolean
  onClick?: () => void
  children: ReactNode
}) => {
  const router = useRouter()
  const { avatar } = useAvatar(name, network)
  const zorb = useZorb(name, 'name')
  const { expiry } = useExpiry(name)

  const isSelectable = useMemo(() => {
    if (mode === 'view') return false
    const labels = name?.split('.')
    return labels?.length === 2 && labels[1] === 'eth'
  }, [name, mode])

  return (
    <OptionalLink
      active={mode !== 'select'}
      href={{
        pathname: `/profile/${name}`,
        query: {
          from: router.asPath,
        },
      }}
      passHref
    >
      <NameItemWrapper
        $highlight={mode === 'select' && selected}
        as={mode !== 'select' ? 'a' : 'div'}
        onClick={() => {
          if (isSelectable) onClick?.()
        }}
      >
        <NameItemContainer>
          <AvatarWrapper>
            <Avatar
              label={truncatedName || name}
              src={avatar || zorb}
              data-testid="name-detail-item-avatar"
            />
            {mode === 'select' && selected && (
              <AvatarOverlay>
                <CircleTick />
              </AvatarOverlay>
            )}
          </AvatarWrapper>
          <NameItemContent>
            <TitleWrapper name={name} />
            {expiry?.expiry && (
              <SubtitleWrapper>
                <ShortExpiry expiry={expiry.expiry} textOnly />
              </SubtitleWrapper>
            )}
          </NameItemContent>
        </NameItemContainer>
        <DetailsContainer>{children}</DetailsContainer>
      </NameItemWrapper>
    </OptionalLink>
  )
}
