import Head from 'next/head'
import { useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Banner, CheckCircleSVG, Typography } from '@ensdomains/thorin2'

import BaseLink from '@app/components/@atoms/BaseLink'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { useQueryParameterState } from '@app/hooks/useQueryParameterState'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { Content, ContentWarning } from '@app/layouts/Content'
import { OG_IMAGE_URL } from '@app/utils/constants'
import { formatFullExpiry, getEncodedLabelAmount } from '@app/utils/utils'

import { shouldShowSuccessPage } from '../../import/[name]/shared'
import MoreTab from './tabs/MoreTab/MoreTab'
import { OwnershipTab } from './tabs/OwnershipTab/OwnershipTab'
import { PermissionsTab } from './tabs/PermissionsTab/PermissionsTab'
import ProfileTab from './tabs/ProfileTab'
import { RecordsTab } from './tabs/RecordsTab'
import { SubnamesTab } from './tabs/SubnamesTab'

const TabButtonContainer = styled.div(
  ({ theme }) => css`
    margin-left: -${theme.radii.extraLarge};
    margin-right: -${theme.radii.extraLarge};
    padding: 0 calc(${theme.radii.extraLarge} * 2);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['6']};
    flex-gap: ${theme.space['6']};
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  `,
)

const TabButton = styled.button<{ $selected: boolean }>(
  ({ theme, $selected }) => css`
    display: block;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    color: ${$selected ? theme.colors.accent : theme.colors.greyPrimary};
    font-size: ${theme.fontSizes.extraLarge};
    transition: all 0.15s ease-in-out;
    cursor: pointer;

    &:hover {
      color: ${$selected ? theme.colors.accentBright : theme.colors.text};
    }
  `,
)

const tabs = ['profile', 'records', 'ownership', 'subnames', 'permissions', 'more'] as const
type Tab = (typeof tabs)[number]

type Props = {
  isSelf: boolean
  isLoading: boolean
  name: string
}

export const NameAvailableBanner = ({
  normalisedName,
  expiryDate,
}: {
  normalisedName: string
  expiryDate?: Date
}) => {
  const { t } = useTranslation('profile')
  return (
    <BaseLink href={`/register/${normalisedName}`} passHref legacyBehavior>
      <Banner
        alert="info"
        as="a"
        icon={<CheckCircleSVG />}
        title={t('banner.available.title', { name: normalisedName })}
      >
        <Trans
          ns="profile"
          i18nKey="banner.available.description"
          values={{
            date: formatFullExpiry(expiryDate),
          }}
          components={{ strong: <strong /> }}
        />
      </Banner>
    </BaseLink>
  )
}

const ProfileContent = ({ isSelf, isLoading: _isLoading, name }: Props) => {
  const router = useRouterWithHistory()
  const { t } = useTranslation('profile')
  const { address } = useAccount()
  const transactions = useRecentTransactions()

  const nameDetails = useNameDetails({ name })
  const {
    error,
    errorTitle,
    profile,
    gracePeriodEndDate,
    expiryDate,
    normalisedName,
    beautifiedName,
    isValid,
    isCachedData,
    isWrapped,
    isLoading: detailsLoading,
    wrapperData,
    registrationStatus,
  } = nameDetails

  const isLoading = _isLoading || detailsLoading

  useProtectedRoute(
    '/',
    // When anything is loading, return true
    isLoading
      ? true
      : // if is self, user must be connected
        (isSelf ? address : true) && typeof name === 'string' && name.length > 0,
  )

  const [titleContent, descriptionContent] = useMemo(() => {
    if (isSelf) {
      return [t('yourProfile'), '']
    }
    if (beautifiedName) {
      return [
        t('meta.title', {
          name: beautifiedName,
        }),
        t('meta.description', {
          name: beautifiedName,
        }),
      ]
    }
    if (typeof isValid === 'boolean' && isValid === false) {
      return [t('errors.invalidName'), t('errors.invalidName')]
    }
    return [
      t('meta.title', {
        name,
      }),
      t('meta.description', {
        name,
      }),
    ]
  }, [isSelf, beautifiedName, isValid, name, t])

  const [tab, setTab] = useQueryParameterState<Tab>('tab', 'profile')
  const visibileTabs = isWrapped ? tabs : tabs.filter((_tab) => _tab !== 'permissions')

  const abilities = useAbilities({ name: normalisedName })

  // hook for redirecting to the correct profile url
  // profile.decryptedName fetches labels from NW/subgraph
  // normalisedName fetches labels from localStorage
  useEffect(() => {
    if (
      name !== profile?.decodedName &&
      profile?.decodedName &&
      !isSelf &&
      getEncodedLabelAmount(normalisedName) > getEncodedLabelAmount(profile.decodedName)
    ) {
      // if the fetched decrypted name is different to the current name
      // and the decrypted name has less encrypted labels than the normalised name
      // direct to the fetched decrypted name
      router.replace(`/profile/${profile.decodedName}`, { shallow: true, maintainHistory: true })
    } else if (
      name !== normalisedName &&
      normalisedName &&
      !isSelf &&
      (!profile?.decodedName ||
        getEncodedLabelAmount(profile.decodedName) > getEncodedLabelAmount(normalisedName)) &&
      decodeURIComponent(name) !== normalisedName
    ) {
      // if the normalised name is different to the current name
      // and the normalised name has less encrypted labels than the decrypted name
      // direct to normalised name
      router.replace(`/profile/${normalisedName}`, { shallow: true, maintainHistory: true })
    }
  }, [profile?.decodedName, normalisedName, name, isSelf, router])

  useEffect(() => {
    if (isSelf && name) {
      router.replace(`/profile/${name}`)
    }
  }, [isSelf, name, router])

  useEffect(() => {
    if (shouldShowSuccessPage(transactions)) {
      router.push(`/import/${name}`)
    }
  }, [name, router, transactions])

  const infoBanner = useMemo(() => {
    if (
      registrationStatus !== 'gracePeriod' &&
      gracePeriodEndDate &&
      gracePeriodEndDate < new Date()
    ) {
      return <NameAvailableBanner {...{ normalisedName, expiryDate }} />
    }
    return undefined
  }, [registrationStatus, gracePeriodEndDate, normalisedName, expiryDate])

  const warning: ContentWarning = useMemo(() => {
    if (error)
      return {
        type: 'warning',
        message: error,
        title: errorTitle,
      }
    return undefined
  }, [error, errorTitle])

  const ogImageUrl = `${OG_IMAGE_URL}/name/${normalisedName || name}`

  return (
    <>
      <Head>
        <title>{titleContent}</title>
        <meta name="description" content={descriptionContent} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:title" content={titleContent} />
        <meta property="og:description" content={descriptionContent} />
        <meta property="twitter:image" content={ogImageUrl} />
        <meta property="twitter:title" content={titleContent} />
        <meta property="twitter:description" content={descriptionContent} />
      </Head>
      <Content noTitle title={beautifiedName} loading={isLoading} copyValue={beautifiedName}>
        {{
          info: infoBanner,
          warning,
          header: (
            <TabButtonContainer>
              {visibileTabs.map((tabItem) => (
                <TabButton
                  key={tabItem}
                  data-testid={`${tabItem}-tab`}
                  $selected={tabItem === tab}
                  onClick={() => setTab(tabItem)}
                >
                  <Typography fontVariant="extraLargeBold" color="inherit">
                    {t(`tabs.${tabItem}.name`)}
                  </Typography>
                </TabButton>
              ))}
            </TabButtonContainer>
          ),
          trailing: {
            profile: <ProfileTab name={normalisedName} nameDetails={nameDetails} />,
            records: (
              <RecordsTab
                name={normalisedName}
                texts={profile?.texts || []}
                addresses={profile?.coins || []}
                contentHash={profile?.contentHash}
                abi={profile?.abi}
                resolverAddress={profile?.resolverAddress}
                canEdit={abilities.data?.canEdit}
                canEditRecords={abilities.data?.canEditRecords}
                isCached={isCachedData}
              />
            ),
            ownership: <OwnershipTab name={normalisedName} details={nameDetails} />,
            subnames: (
              <SubnamesTab
                name={normalisedName}
                isWrapped={isWrapped}
                canEdit={!!abilities.data?.canEdit}
                canCreateSubdomains={!!abilities.data?.canCreateSubdomains}
              />
            ),
            permissions: (
              <PermissionsTab
                name={normalisedName}
                wrapperData={wrapperData}
                isCached={isCachedData}
              />
            ),
            more: (
              <MoreTab name={normalisedName} nameDetails={nameDetails} abilities={abilities.data} />
            ),
          }[tab],
        }}
      </Content>
    </>
  )
}

export default ProfileContent
