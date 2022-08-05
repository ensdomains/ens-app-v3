import { useAvatar } from '@app/hooks/useAvatar'
import { ReturnedName } from '@app/hooks/useNamesFromAddress'
import { useZorb } from '@app/hooks/useZorb'
import { Avatar, mq, Tag, Typography } from '@ensdomains/thorin'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { ShortExpiry } from '../ExpiryComponents/ExpiryComponents'

const NameItemWrapper = styled.div(
  ({ theme }) => css`
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

const OtherItemsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    ${mq.md.min(css`
      gap: ${theme.space['4']};
      flex-gap: ${theme.space['4']};
    `)}
  `,
)

export const TaggedNameItem = ({
  name,
  isController,
  isRegistrant,
  expiryDate,
  network,
  truncatedName,
}: Omit<ReturnedName, 'labelName' | 'labelhash' | 'isMigrated' | 'parent' | 'type' | 'id'> & {
  network: number
}) => {
  const { t } = useTranslation('common')

  const isNativeEthName = /\.eth$/.test(name) && name.split('.').length === 2

  return (
    <NameDetailItem key={name} network={network} truncatedName={truncatedName} name={name}>
      <OtherItemsContainer>
        {expiryDate && <ShortExpiry expiry={expiryDate} />}
        <Tag tone={isController ? 'accent' : 'secondary'}>{t('name.controller')}</Tag>
        {isNativeEthName && (
          <Tag tone={isRegistrant ? 'accent' : 'secondary'}>{t('name.registrant')}</Tag>
        )}
      </OtherItemsContainer>
    </NameDetailItem>
  )
}
