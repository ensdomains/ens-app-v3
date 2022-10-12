import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Colors, Dropdown, Typography } from '@ensdomains/thorin'

import FastForwardSVG from '@app/assets/FastForward.svg'
import TripleDot from '@app/assets/TripleDot.svg'

import { useTransactionFlow } from '../transaction-flow/TransactionFlowProvider'
import { DisabledButton } from './@atoms/DisabledButton'
import { NameAvatar } from './AvatarWithZorb'

const Container = styled.div<{ $banner?: string; $size?: 'small' | 'medium' }>(
  ({ theme, $banner, $size }) => [
    css`
      padding: ${$size === 'medium' ? theme.space['8'] : theme.space['6']};
      padding-top: ${theme.space['16']};
      background-image: ${$banner ? `url(${$banner})` : theme.colors.gradients.blue};
      background-repeat: no-repeat;
      background-attachment: scroll;
      background-size: 100% ${theme.space['28']};
      background-color: ${theme.colors.background};
      border-radius: ${theme.radii['2xLarge']};
      border: ${theme.space.px} solid ${theme.colors.borderTertiary};
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: ${theme.space['3']};
      flex-gap: ${theme.space['3']};
    `,
  ],
)

const DetailStack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: ${theme.space['1']};
  `,
)

const Name = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
  `,
)

const NameRecord = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.large};
    color: ${theme.colors.textTertiary};
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

const DetailButtonWrapper = styled.div<{ $placement?: 'inline' | 'bottom' }>(
  ({ theme, $placement }) => css`
    ${$placement === 'bottom' && 'width: 100%;'}

    & > button {
      border: ${theme.space.px} solid ${theme.colors.borderSecondary};
      border-radius: ${theme.radii.extraLarge};
      padding: ${theme.space['2']};
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

const InnerButton = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const ButtonIcon = styled.svg(
  ({ theme }) => css`
    display: block;
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

const TripleDotIcon = styled.div(
  ({ theme }) => css`
    display: block;
    box-sizing: border-box;
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

const DropdownWrapper = styled.div(
  ({ theme }) => css`
    & > div > div {
      min-width: ${theme.space['48']};

      button {
        height: ${theme.space['10']};
      }
    }
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
      color: ${theme.colors.textTertiary};
    }

    #profile-url {
      font-weight: bold;
    }
  `,
)

export const ProfileSnippet = ({
  name,
  getTextRecord,
  button,
  size = 'small',
  buttonPlacement = 'inline',
  network,
  actions,
  canEdit,
}: {
  name: string
  getTextRecord?: (key: string) => { value: string } | undefined
  button?: 'viewDetails' | 'viewProfile' | 'extend'
  size?: 'small' | 'medium'
  buttonPlacement?: 'inline' | 'bottom'
  canEdit?: boolean
  network: number
  actions?: {
    onClick: () => void
    color?: Colors
    label: string
    disabled?: boolean
  }[]
}) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const hasActions = actions && actions.length > 0

  const { showDataInput } = useTransactionFlow()

  const banner = getTextRecord?.('banner')?.value
  const description = getTextRecord?.('description')?.value
  const url = getTextRecord?.('url')?.value
  const location = getTextRecord?.('location')?.value
  const recordName = getTextRecord?.('name')?.value

  const ActionButton = useMemo(() => {
    if (button === 'extend' && buttonPlacement === 'inline')
      return (
        <Button
          size="extraSmall"
          shadowless
          disabled={false}
          variant="transparent"
          data-testid="extend-button"
          onClick={() => {
            showDataInput(`extend-names-${name}`, 'ExtendNames', { names: [name], isSelf: canEdit })
          }}
        >
          <InnerButton>
            <ButtonIcon as={FastForwardSVG} />
            <Typography weight="bold">{t('action.extend', { ns: 'common' })}</Typography>
          </InnerButton>
        </Button>
      )
    if (button === 'viewDetails' || button === 'viewProfile')
      return (
        <Button
          onClick={() =>
            router.push({
              pathname: button === 'viewDetails' ? `/profile/${name}/details` : `/profile/${name}`,
              query: {
                from: router.asPath,
              },
            })
          }
          shadowless
          variant="transparent"
          size="extraSmall"
        >
          {t(`wallet.${button}`)}
        </Button>
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [button, name, buttonPlacement, canEdit])

  return (
    <Container $banner={banner} $size={size} data-testid="profile-snippet">
      <FirstItems>
        <NameAvatar size="24" label={name} name={name} network={network} />
        <ButtonStack>
          {ActionButton && buttonPlacement === 'inline' && (
            <DetailButtonWrapper $placement={buttonPlacement}>{ActionButton}</DetailButtonWrapper>
          )}
          {hasActions ? (
            <DropdownWrapper>
              <Dropdown
                items={actions.map((action) => ({
                  ...action,
                  color: action.color || 'text',
                }))}
                menuLabelAlign="flex-end"
                align="right"
                shortThrow
              >
                <Button
                  data-testid="profile-actions"
                  shadowless
                  variant="transparent"
                  size="extraSmall"
                >
                  <TripleDotIcon as={TripleDot} />
                </Button>
              </Dropdown>
            </DropdownWrapper>
          ) : (
            <DisabledButton shadowless variant="transparent" size="extraSmall">
              <TripleDotIcon as={TripleDot} />
            </DisabledButton>
          )}
        </ButtonStack>
      </FirstItems>
      <TextStack>
        <DetailStack>
          <Name weight="bold">{name}</Name>
          {recordName && <NameRecord data-testid="profile-snippet-name">{recordName}</NameRecord>}
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
              <a href={url} data-testid="profile-snippet-url">
                <Typography color="blue" id="profile-url">
                  {url?.replace(/http(s?):\/\//g, '').replace(/\/$/g, '')}
                </Typography>
              </a>
            )}
          </LocationAndUrl>
        )}
      </TextStack>
      {ActionButton && buttonPlacement === 'bottom' && (
        <DetailButtonWrapper $placement={buttonPlacement}>{ActionButton}</DetailButtonWrapper>
      )}
    </Container>
  )
}
