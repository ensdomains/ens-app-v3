import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Avatar, Typography, mq } from '@ensdomains/thorin'

import { useAvatar } from '@app/hooks/useAvatar'
import { useZorb } from '@app/hooks/useZorb'

const NameItemWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: ${theme.space['3']} ${theme.space['4.5']};
    border-bottom: 1px solid ${theme.colors.borderTertiary};
    transition: all 0.15s ease-in-out;
    &:hover {
      background-color: ${theme.colors.backgroundSecondary};
    }
    &:last-of-type {
      border: none;
    }
  `,
)

const NameItemContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex-gap: 16px;
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['9']};
  `,
)

const TypeWrapper = styled.div(
  ({ theme }) => css`
    max-width: ${theme.space['48']};
    ${mq.md.min(css`
      max-width: ${theme.space['96']};
    `)}
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
  children,
}: Name & {
  network: number
  children: ReactNode
}) => {
  const router = useRouter()
  const { avatar } = useAvatar(name, network)

  const zorb = useZorb(name, 'name')

  return (
    <Link
      href={{
        pathname: `/profile/${name}`,
        query: {
          from: router.asPath,
        },
      }}
      passHref
    >
      <NameItemWrapper as="a">
        <NameItemContainer>
          <AvatarWrapper>
            <Avatar
              label={truncatedName || name}
              src={avatar || zorb}
              data-testid="name-detail-item-avatar"
            />
          </AvatarWrapper>
          <TypeWrapper>
            <Typography color="text" ellipsis weight="bold" variant="extraLarge">
              {truncatedName}
            </Typography>
          </TypeWrapper>
        </NameItemContainer>
        {children}
      </NameItemWrapper>
    </Link>
  )
}
