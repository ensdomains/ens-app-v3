import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, mq, NametagSVG, Tag, Typography } from '@ensdomains/thorin'

import FastForwardSVG from '@app/assets/FastForward.svg'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useBeautifiedName } from '@app/hooks/useBeautifiedName'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'

import { useTransactionFlow } from '../transaction-flow/TransactionFlowProvider'
import { NameAvatar } from './AvatarWithZorb'

const Container = styled.div<{ $banner?: string }>(
  ({ theme, $banner }) => css`
    width: 100%;
    padding: ${theme.space['4']};
    padding-top: ${theme.space['18']};
    background-image: ${$banner ? `url(${$banner})` : theme.colors.gradients.blue};
    background-repeat: no-repeat;
    background-attachment: scroll;
    background-size: 100% ${theme.space['28']};
    background-position-y: -1px; // for overlap with border i think
    background-color: ${theme.colors.background};
    border-radius: ${theme.radii['2xLarge']};
    border: ${theme.space.px} solid ${theme.colors.border};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};

    ${mq.sm.min(css`
      padding: ${theme.space['6']};
      padding-top: ${theme.space['12']};
    `)}
  `,
)

const DetailStack = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    overflow: hidden;
  `,
)

const Name = styled(Typography)(
  () => css`
    width: 100%;
    overflow-wrap: anywhere;
  `,
)

const NameRecord = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.greyPrimary};
    margin-top: -${theme.space['0.5']};
  `,
)

const TextStack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: ${theme.space['1']};
    flex-gap: ${theme.space['1']};
    width: 100%;
    overflow: hidden;
  `,
)

const FirstItems = styled.div(
  () => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  `,
)

const DetailButtonWrapper = styled.div(
  ({ theme }) => css`
    & > button {
      border-radius: ${theme.radii.large};
    }
  `,
)

const ButtonStack = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  `,
)

const LocationAndUrl = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};

    #profile-loc {
      color: ${theme.colors.greyPrimary};
    }

    #profile-url {
      font-weight: bold;
    }
  `,
)

const TagsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
  `,
)

const PrimaryNameTag = styled(Tag)(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['1']};

    & > svg {
      height: ${theme.space['4']};
      width: ${theme.space['4']};
    }
  `,
)

export const getUserDefinedUrl = (url?: string) => {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return ``
}

export const ProfileSnippet = ({
  name,
  getTextRecord,
  button,
  // network,
  isPrimary,
  children,
}: {
  name: string
  getTextRecord?: (key: string) => { value: string } | undefined
  button?: 'viewProfile' | 'extend' | 'register'
  isPrimary?: boolean
  children?: React.ReactNode
}) => {
  const router = useRouterWithHistory()
  const { t } = useTranslation('common')

  const { usePreparedDataInput } = useTransactionFlow()
  const showExtendNamesInput = usePreparedDataInput('ExtendNames')
  const abilities = useAbilities({ name })

  const beautifiedName = useBeautifiedName(name)

  const banner = getTextRecord?.('banner')?.value
  const description = getTextRecord?.('description')?.value
  const url = getUserDefinedUrl(getTextRecord?.('url')?.value)
  const location = getTextRecord?.('location')?.value
  const recordName = getTextRecord?.('name')?.value

  const ActionButton = useMemo(() => {
    if (button === 'extend')
      return (
        <Button
          size="small"
          colorStyle="accentSecondary"
          prefix={<FastForwardSVG />}
          data-testid="extend-button"
          onClick={() => {
            showExtendNamesInput(`extend-names-${name}`, {
              names: [name],
              isSelf: abilities.data?.canSelfExtend,
            })
          }}
        >
          {t('action.extend', { ns: 'common' })}
        </Button>
      )
    if (button === 'register')
      return (
        <Button
          onClick={() => router.pushWithHistory(`/register/${name}`)}
          size="small"
          colorStyle="accentSecondary"
        >
          {t(`wallet.${button}`)}
        </Button>
      )
    if (button === 'viewProfile')
      return (
        <Button
          onClick={() => router.pushWithHistory(`/profile/${name}`)}
          size="small"
          colorStyle="accentSecondary"
        >
          {t(`wallet.${button}`)}
        </Button>
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [button, name, abilities.data])

  return (
    <Container $banner={banner} data-testid="profile-snippet">
      <FirstItems>
        <NameAvatar
          size={{ min: '24', sm: '32' }}
          label={name}
          name={name}
          noCache={abilities.data.canEdit}
          decoding="sync"
        />
        <ButtonStack>
          {ActionButton && <DetailButtonWrapper>{ActionButton}</DetailButtonWrapper>}
        </ButtonStack>
      </FirstItems>
      <TextStack>
        <DetailStack>
          <Name fontVariant="headingTwo" data-testid="profile-snippet-name">
            {beautifiedName}
          </Name>
          {recordName && (
            <NameRecord data-testid="profile-snippet-nickname">{recordName}</NameRecord>
          )}
        </DetailStack>
        {description && (
          <Typography data-testid="profile-snippet-description">{description}</Typography>
        )}
        {(url || location) && (
          <LocationAndUrl>
            {location && (
              <Typography id="profile-loc" data-testid="profile-snippet-location">
                {location}
              </Typography>
            )}
            {url && (
              <a href={url} data-testid="profile-snippet-url" target="_blank" rel="noreferrer">
                <Typography color="blue" id="profile-url">
                  {url?.replace(/http(s?):\/\//g, '').replace(/\/$/g, '')}
                </Typography>
              </a>
            )}
          </LocationAndUrl>
        )}
      </TextStack>
      {isPrimary && (
        <TagsContainer>
          <PrimaryNameTag size="medium" colorStyle="greenSecondary">
            <NametagSVG />
            {t('name.yourPrimaryName')}
          </PrimaryNameTag>
        </TagsContainer>
      )}
      {children}
    </Container>
  )
}
