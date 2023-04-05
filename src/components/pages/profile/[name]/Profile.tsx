import Head from 'next/head'
import { useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { getEncryptedLabelAmount } from '@ensdomains/ensjs/utils/labels'
import { Banner, CheckCircleSVG, Typography } from '@ensdomains/thorin'

import BaseLink from '@app/components/@atoms/BaseLink'
import { WrapperCallToAction } from '@app/components/pages/profile/[name]/tabs/WrapperCallToAction'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { useQueryParameterState } from '@app/hooks/useQueryParameterState'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { Content } from '@app/layouts/Content'
import { formatFullExpiry } from '@app/utils/utils'

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

const ProfileContent = ({ nameDetails, isSelf, isLoading, name }: Props) => {
  const router = useRouterWithHistory()
  const { t } = useTranslation('profile')
  const chainId = useChainId()
  const { address } = useAccount()
  const transactions = useRecentTransactions()

  const {
    error,
    errorTitle,
    profile,
    ownerData,
    gracePeriodEndDate,
    expiryDate,
    normalisedName,
    beautifiedName,
    isValid,
    profileIsCachedData,
    basicIsCachedData,
    isWrapped,
    isLoading: detailsLoading,
    canBeWrapped,
    wrapperData,
  } = nameDetails

  const _canBeWrapped =
    canBeWrapped &&
    !!address &&
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

  const selfAbilities = useSelfAbilities(address, name)

  // hook for redirecting to the correct profile url
  // profile.decryptedName fetches labels from NW/subgraph
  // normalisedName fetches labels from localStorage
  useEffect(() => {
    if (
      name !== profile?.decryptedName &&
      profile?.decryptedName &&
      !isSelf &&
      getEncryptedLabelAmount(normalisedName) > getEncryptedLabelAmount(profile.decryptedName)
    ) {
      // if the fetched decrypted name is different to the current name
      // and the decrypted name has less encrypted labels than the normalised name
      // direct to the fetched decrypted name
      router.replace(`/profile/${profile.decryptedName}`, { shallow: true, maintainHistory: true })
    } else if (
      name !== normalisedName &&
      normalisedName &&
      !isSelf &&
      (!profile?.decryptedName ||
        getEncryptedLabelAmount(profile.decryptedName) > getEncryptedLabelAmount(normalisedName)) &&
      decodeURIComponent(name) !== normalisedName
    ) {
      // if the normalised name is different to the current name
      // and the normalised name has less encrypted labels than the decrypted name
      // direct to normalised name
      router.replace(`/profile/${normalisedName}`, { shallow: true, maintainHistory: true })
    }
  }, [profile?.decryptedName, normalisedName, name, isSelf, router])

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
    if (gracePeriodEndDate && gracePeriodEndDate < new Date()) {
      return <NameAvailableBanner {...{ normalisedName, expiryDate }} />
    }
    if (_canBeWrapped) {
      return <WrapperCallToAction name={normalisedName} />
    }
    return undefined
  }, [gracePeriodEndDate, normalisedName, _canBeWrapped, expiryDate])

  return (
    <>
      <Head>
        <title>{titleContent}</title>
        <meta name="description" content={descriptionContent} />
      </Head>
      <Content
        noTitle
        title={beautifiedName}
        loading={isLoading || detailsLoading}
        copyValue={beautifiedName}
      >
        {{
          info: infoBanner,
          warning: error
            ? {
                type: 'warning',
                message: error,
                title: errorTitle,
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
                abi={profile?.records?.abi}
                resolverAddress={profile?.resolverAddress}
                canEdit={selfAbilities.canEdit}
                isCached={profileIsCachedData}
                isWrapped={isWrapped}
              />
            ),
            subnames: (
              <SubnamesTab
                name={normalisedName}
                isWrapped={isWrapped}
                canEdit={selfAbilities.canEdit}
                canCreateSubdomains={selfAbilities.canCreateSubdomains}
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
