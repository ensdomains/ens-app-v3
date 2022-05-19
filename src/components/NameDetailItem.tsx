import { useAvatar } from '@app/hooks/useAvatar'
import { useZorb } from '@app/hooks/useZorb'
import mq from '@app/mediaQuery'
import { Avatar, Typography } from '@ensdomains/thorin'
import Link from 'next/link'
import { ReactNode } from 'react'
import styled, { css } from 'styled-components'

const NameItemWrapper = styled.div`
  ${({ theme }) => `
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
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
  `}
`

const NameItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-gap: 16px;
`

const AvatarWrapper = styled.div`
  ${({ theme }) => `
    width: ${theme.space['9']};
  `}
`

const TypeWrapper = styled.div`
  ${({ theme }) => css`
    max-width: ${theme.space['48']};
    ${mq.medium.min`
      max-width: ${theme.space['96']};
    `}
  `}
`

type Name = {
  id: string
  name: string
  truncatedName?: string
}

export const NameDetailItem = ({
  id,
  name,
  truncatedName,
  network,
  children,
}: Name & {
  network: string
  children: ReactNode
}) => {
  const avatar = useAvatar(name, network)
  const zorb = useZorb(id, 'hash')

  return (
    <Link href={`/profile/${name}`} passHref>
      <NameItemWrapper as="a">
        <NameItemContainer>
          <AvatarWrapper>
            <Avatar label={truncatedName || name} src={avatar || zorb} />
          </AvatarWrapper>
          <TypeWrapper>
            <Typography
              color="text"
              ellipsis
              weight="bold"
              variant="extraLarge"
            >
              {truncatedName}
            </Typography>
          </TypeWrapper>
        </NameItemContainer>
        {children}
      </NameItemWrapper>
    </Link>
  )
}
