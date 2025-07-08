import Head from 'next/head'
import { useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import { Banner, CheckCircleSVG, Typography } from '@ensdomains/thorin'

import BaseLink from '@app/components/@atoms/BaseLink'
import { Outlink } from '@app/components/Outlink'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useChainName } from '@app/hooks/chain/useChainName'
import { useRenew } from '@app/hooks/pages/profile/useRenew/useRenew'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { useQueryParameterState } from '@app/hooks/useQueryParameterState'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { Content, ContentWarning } from '@app/layouts/Content'
import { OG_IMAGE_URL } from '@app/utils/constants'
import { shouldRedirect } from '@app/utils/shouldRedirect'
import { formatFullExpiry, makeEtherscanLink } from '@app/utils/utils'

import { ProfileEmptyBanner } from './ProfileEmptyBanner'
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
        icon={CheckCircleSVG}
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

const ProfileContent = ({ isSelf, isLoading: parentIsLoading, name }: Props) => {
  const router = useRouterWithHistory()
  const { t } = useTranslation('profile')
  const { address } = useAccount()

  const nameDetails = useNameDetails({ name })
  const {
    unsupported,
    error,
    profile,
    gracePeriodEndDate,
    expiryDate,
    normalisedName,
    beautifiedName,
    isValid,
    isCachedData,
    isWrapped,
    wrapperData,
    registrationStatus,
    isBasicLoading,
    refetchIfEnabled,
  } = nameDetails

  useProtectedRoute(
    '/',
    // When anything is loading, return true
    parentIsLoading
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

  const [tab, setTab_] = useQueryParameterState<Tab>('tab', 'profile')
  const setTab: typeof setTab_ = (value) => {
    refetchIfEnabled()
    setTab_(value)
  }

  const isWrappedOrLoading = isWrapped || isBasicLoading
  const visibileTabs = useMemo(
    () =>
      (isWrappedOrLoading ? tabs : tabs.filter((_tab) => _tab !== 'permissions')).filter((_tab) =>
        unsupported ? _tab === 'profile' : _tab,
      ),
    [isWrappedOrLoading, unsupported],
  )

  const abilities = useAbilities({ name: normalisedName })

  // hook for redirecting to the correct profile url
  // profile.decryptedName fetches labels from NW/subgraph
  // normalisedName fetches labels from localStorage
  useEffect(() => {
    shouldRedirect(router, 'Profile.tsx', '/profile', {
      isSelf,
      name,
      decodedName: profile?.decodedName,
      normalisedName,
      visibileTabs,
      tab,
    })
  }, [profile?.decodedName, normalisedName, name, isSelf, router, tab, visibileTabs])

  // useEffect(() => {
  //   if (shouldShowSuccessPage(transactions)) {
  //     router.push(`/import/${name}`)
  //   }
  // }, [name, router, transactions])

  useRenew(normalisedName)

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
        type: error.type || 'warning',
        message: error.content,
        title: error.title,
      }
    return undefined
  }, [error])

  const ogImageUrl = `${OG_IMAGE_URL}/name/${normalisedName || name}`

  const chainName = useChainName()

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
      <Content
        noTitle
        title={beautifiedName}
        loading={!isCachedData && parentIsLoading}
        copyValue={beautifiedName}
      >
        {{
          info: infoBanner,
          warning,
          header: (
            <>
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
              <ProfileEmptyBanner name={normalisedName} />
            </>
          ),
          titleExtra: profile?.address ? (
            <Outlink
              fontVariant="bodyBold"
              href={makeEtherscanLink(profile.address!, chainName, 'address')}
            >
              {t('etherscan', { ns: 'common' })}
            </Outlink>
          ) : null,
          trailing: match(tab)
            .with('records', () => (
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
            ))
            .with('ownership', () => <OwnershipTab name={normalisedName} details={nameDetails} />)
            .with('subnames', () => (
              <SubnamesTab
                name={normalisedName}
                isWrapped={isWrapped}
                canEdit={!!abilities.data?.canEdit}
                canCreateSubdomains={!!abilities.data?.canCreateSubdomains}
                canCreateSubdomainsError={abilities.data?.canCreateSubdomainsError}
              />
            ))
            .with('permissions', () => (
              <PermissionsTab
                name={normalisedName}
                wrapperData={wrapperData}
                isCached={isCachedData}
              />
            ))
            .with('more', () => (
              <MoreTab name={normalisedName} nameDetails={nameDetails} abilities={abilities.data} />
            ))
            .otherwise(() => <ProfileTab name={normalisedName} nameDetails={nameDetails} />),
        }}
      </Content>
    </>
  )
}

export default ProfileContent
