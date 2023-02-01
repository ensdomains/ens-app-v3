import Head from 'next/head'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Typography } from '@ensdomains/thorin'

import { WrapperCallToAction } from '@app/components/pages/profile/[name]/tabs/WrapperCallToAction'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { Content } from '@app/layouts/Content'

import { shouldShowSuccessPage } from '../../import/[name]/shared'
import MoreTab from './tabs/MoreTab/MoreTab'
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

const tabs = ['profile', 'records', 'subnames', 'permissions', 'more'] as const
type Tab = typeof tabs[number]

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  isSelf: boolean
  isLoading: boolean
  name: string
}

const ProfileContent = ({ nameDetails, isSelf, isLoading, name }: Props) => {
  const router = useRouterWithHistory()
  const { t } = useTranslation('profile')
  const chainId = useChainId()
  const { address } = useAccount()
  const transactions = useRecentTransactions()

  const {
    error,
    profile,
    ownerData,
    normalisedName,
    valid,
    profileIsCachedData,
    basicIsCachedData,
    isWrapped,
    isLoading: detailsLoading,
    canBeWrapped,
    wrapperData,
  } = nameDetails

  const _canBeWrapped =
    canBeWrapped &&
    (ownerData?.ownershipLevel === 'registrar'
      ? ownerData?.registrant === address
      : ownerData?.owner === address)

  useProtectedRoute(
    '/',
    // When anything is loading, return true
    isLoading
      ? true
      : // if is self, user must be connected
        (isSelf ? address : true) && typeof name === 'string' && name.length > 0,
  )

  useEffect(() => {
    if (isSelf && name) {
      router.replace(`/profile/${name}`)
    }
  }, [isSelf, name, router])

  const [titleContent, descriptionContent] = useMemo(() => {
    if (isSelf) {
      return [t('yourProfile'), '']
    }
    if (normalisedName) {
      return [
        t('meta.title', {
          name: normalisedName,
        }),
        t('meta.description', {
          name: normalisedName,
        }),
      ]
    }
    if (typeof valid === 'boolean' && valid === false) {
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
  }, [isSelf, normalisedName, valid, name, t])

  const tab = (router.query.tab as Tab) || 'profile'
  const setTab = (newTab: Tab) => {
    const url = new URL(router.asPath, window.location.origin)
    for (const [key, value] of Object.entries(router.query)) {
      url.searchParams.set(key, value as string)
    }
    url.searchParams.set('tab', newTab)
    router._replace(url.toString(), undefined, {
      shallow: true,
    })
  }
  const visibileTabs = isWrapped ? tabs : tabs.filter((_tab) => _tab !== 'permissions')

  const selfAbilities = useSelfAbilities(address, name)

  useEffect(() => {
    if (shouldShowSuccessPage(transactions)) {
      router.push(`/import/${name}`)
    }
  }, [name, router, transactions])

  return (
    <>
      <Head>
        <title>{titleContent}</title>
        <meta name="description" content={descriptionContent} />
      </Head>
      <Content
        noTitle
        title={isSelf ? t('yourProfile') : normalisedName}
        subtitle={isSelf ? normalisedName : 'Profile'}
        loading={isLoading || detailsLoading}
      >
        {{
          info: _canBeWrapped && <WrapperCallToAction name={normalisedName} />,
          warning: error
            ? {
                type: 'warning',
                message: error,
              }
            : undefined,
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
                network={chainId}
                name={normalisedName}
                texts={(profile?.records?.texts as any) || []}
                addresses={(profile?.records?.coinTypes as any) || []}
                contentHash={profile?.records?.contentHash}
                canEdit={selfAbilities.canEdit}
                isCached={profileIsCachedData}
              />
            ),
            subnames: (
              <SubnamesTab
                name={normalisedName}
                isWrapped={isWrapped}
                canEdit={selfAbilities.canEdit}
                network={chainId}
              />
            ),
            permissions: (
              <PermissionsTab
                name={normalisedName}
                wrapperData={wrapperData}
                isCached={basicIsCachedData}
              />
            ),
            more: (
              <MoreTab
                name={normalisedName}
                nameDetails={nameDetails}
                selfAbilities={selfAbilities}
              />
            ),
          }[tab],
        }}
      </Content>
    </>
  )
}

export default ProfileContent
