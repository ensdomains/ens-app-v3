import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, BoxProps, Button, cssVars, NametagSVG, Tag, Typography } from '@ensdomains/thorin'

import FastForwardSVG from '@app/assets/FastForward.svg'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useBeautifiedName } from '@app/hooks/useBeautifiedName'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { shouldShowExtendWarning } from '@app/utils/abilities/shouldShowExtendWarning'

import { useTransactionFlow } from '../../transaction-flow/TransactionFlowProvider'
import { NameAvatar } from '../AvatarWithZorb'
import { snippet } from './style.css'

const Container = ({ $banner, ...props }: BoxProps & { $banner?: string }) => (
  <Box
    {...props}
    width="$full"
    className={snippet}
    padding={{ base: '$4', sm: '$6' }}
    paddingTop={{ base: '$18', sm: '$12' }}
    backgroundImage={$banner ? `url(${$banner})` : cssVars.color.blueGradient}
    backgroundColor="$background"
    borderRadius="$2.5xLarge"
    border={`1px solid ${cssVars.color.border}`}
    display="flex"
    flexDirection="column"
    alignItems="flex-start"
    justifyContent="center"
    gap="$4"
  />
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
              isSelf: shouldShowExtendWarning(abilities.data),
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
      <Box width="$full" display="flex" alignItems="flex-end" justifyContent="space-between">
        <NameAvatar
          size={{ base: '$24', sm: '$32' }}
          label={name}
          name={name}
          noCache={abilities.data.canEdit}
        />
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          {ActionButton && <Box>{ActionButton}</Box>}
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        gap="$1"
        width="$full"
        overflow="hidden"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          width="$full"
          overflow="hidden"
        >
          <Typography
            fontVariant="headingTwo"
            data-testid="profile-snippet-name"
            width="$full"
            overflowWrap="anywhere"
          >
            {beautifiedName}
          </Typography>
          {recordName && (
            <Typography
              data-testid="profile-snippet-nickname"
              marginTop="$-0.5"
              color="greyPrimary"
            >
              {recordName}
            </Typography>
          )}
        </Box>
        {description && (
          <Typography data-testid="profile-snippet-description">{description}</Typography>
        )}
        {(url || location) && (
          <Box display="flex" alignItems="center" justifyContent="flex-start" gap="$2">
            {location && (
              <Typography
                id="profile-loc"
                data-testid="profile-snippet-location"
                color="greyPrimary"
              >
                {location}
              </Typography>
            )}
            {url && (
              <a href={url} data-testid="profile-snippet-url" target="_blank" rel="noreferrer">
                <Typography color="blue" id="profile-url" fontWeight="bold">
                  {url?.replace(/http(s?):\/\//g, '').replace(/\/$/g, '')}
                </Typography>
              </a>
            )}
          </Box>
        )}
      </Box>
      {isPrimary && (
        <Box display="flex" alignItems="center" justifyContent="flex-start" gap="$2">
          <Tag
            size="medium"
            colorStyle="greenSecondary"
            display="flex"
            gap="$1"
            alignItems="center"
          >
            <Box as={<NametagSVG />} wh="$4" />
            {t('name.yourPrimaryName')}
          </Tag>
        </Box>
      )}
      {children}
    </Container>
  )
}
