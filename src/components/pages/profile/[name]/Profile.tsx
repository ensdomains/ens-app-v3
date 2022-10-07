import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Colors } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { NameSnippet } from '@app/components/pages/profile/NameSnippet'
import { ProfileDetails } from '@app/components/pages/profile/ProfileDetails'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { usePrimary } from '@app/hooks/usePrimary'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { Content } from '@app/layouts/Content'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { GenericTransaction } from '@app/transaction-flow/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { useSubnameAbilities } from '../../../../hooks/useSubnameAbilities'

const DetailsWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    width: 100%;
  `,
)

const SelfButtons = styled(CacheableComponent)(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};

    & > button {
      border-radius: ${theme.radii.extraLarge};
      border: ${theme.space.px} solid ${theme.colors.borderTertiary};
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.02);
      background-color: ${theme.colors.background};
    }
  `,
)

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  primary: ReturnType<typeof usePrimary>
  isSelf: boolean
  isLoading: boolean
  _name: string
  name: string
}

const ProfileContent = ({ nameDetails, primary, isSelf, isLoading, name, _name }: Props) => {
  const router = useRouter()
  const { t } = useTranslation('profile')
  const breakpoints = useBreakpoint()
  const chainId = useChainId()
  const { address } = useAccount()

  const { name: ensName } = primary

  const {
    error,
    profile,
    ownerData,
    expiryDate,
    normalisedName,
    dnsOwner,
    valid,
    basicIsCachedData,
    profileIsCachedData,
  } = nameDetails

  const selfAbilities = useSelfAbilities(address, ownerData)
  const subNameAbilities = useSubnameAbilities(name, ownerData)

  const { createTransactionFlow } = useTransactionFlow()

  useProtectedRoute(
    '/',
    // When anything is loading, return true
    isLoading
      ? true
      : // if is self, user must be connected
        (isSelf ? address : true) && typeof name === 'string' && name.length > 0,
  )

  const getTextRecord = (key: string) => profile?.records?.texts?.find((x) => x.key === key)

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

  const { showDataInput } = useTransactionFlow()
  const handleEditProfile = () => {
    showDataInput(`edit-profile-${name}`, 'ProfileEditor', { name })
  }

  console.log(subNameAbilities)
  const profileActions = useMemo(() => {
    const actions: { onClick: () => void; color?: Colors; label: string; disabled?: boolean }[] = []
    if (!isSelf && (selfAbilities.canEdit || profile?.address === address) && ensName !== _name) {
      const setAsPrimaryTransactions: GenericTransaction[] = [
        makeTransactionItem('setPrimaryName', {
          name,
          address: address!,
        }),
      ]
      if (profile?.address !== address) {
        setAsPrimaryTransactions.unshift(
          makeTransactionItem('updateEthAddress', {
            address: address!,
            name,
          }),
        )
      }
      actions.push({
        label: t('tabs.profile.actions.setAsPrimaryName.label'),
        onClick: () =>
          createTransactionFlow(`setPrimaryName-${name}-${address}`, {
            transactions: setAsPrimaryTransactions,
            resumable: true,
            intro:
              setAsPrimaryTransactions.length > 1
                ? {
                    title: t('tabs.profile.actions.setAsPrimaryName.title'),
                    content: makeIntroItem('ChangePrimaryName', undefined),
                  }
                : undefined,
          }),
      })
    }

    if (subNameAbilities.canDelete && subNameAbilities.canDeleteContract) {
      actions.push({
        label: t('tabs.profile.actions.deleteSubname.label'),
        onClick: () =>
          createTransactionFlow(`deleteSubname-${name}`, {
            transactions: [
              makeTransactionItem('deleteSubname', {
                name,
                contract: subNameAbilities.canDeleteContract!,
              }),
            ],
          }),
        color: 'red',
      })
    }

    if (subNameAbilities.canDeleteError) {
      actions.push({
        label: t('tabs.profile.actions.deleteSubname.label'),
        onClick: () => {},
        disabled: true,
        color: 'red',
      })
    }

    if (actions.length === 0) return undefined
    return actions
  }, [
    isSelf,
    selfAbilities.canEdit,
    profile?.address,
    subNameAbilities,
    address,
    ensName,
    _name,
    name,
    t,
    createTransactionFlow,
  ])

  console.log(profileActions)

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
        loading={isLoading}
      >
        {{
          warning: error
            ? {
                type: 'warning',
                message: error,
              }
            : undefined,
          leading: breakpoints.md && ownerData && (
            <NameSnippet
              name={normalisedName}
              network={chainId}
              ownerData={ownerData}
              expiryDate={expiryDate}
              showButton={!selfAbilities.canEdit}
              dnsOwner={dnsOwner}
              isCached={basicIsCachedData}
            />
          ),
          trailing: (
            <DetailsWrapper>
              <ProfileSnippet
                name={normalisedName}
                network={chainId}
                getTextRecord={getTextRecord}
                button={isSelf || breakpoints.md ? undefined : 'viewDetails'}
                size={breakpoints.md ? 'medium' : 'small'}
                actions={profileActions}
              />
              {selfAbilities.canEdit && (
                <SelfButtons $isCached={profileIsCachedData}>
                  <Button shadowless variant="transparent" size="small" onClick={handleEditProfile}>
                    {t('editProfile')}
                  </Button>
                  <Button
                    onClick={() =>
                      router.push({
                        pathname: `/profile/${normalisedName}/details`,
                        query: {
                          from: router.asPath,
                        },
                      })
                    }
                    shadowless
                    variant="transparent"
                    size="small"
                  >
                    {t('viewDetails')}
                  </Button>
                </SelfButtons>
              )}
              <ProfileDetails
                isCached={profileIsCachedData}
                addresses={(profile?.records?.coinTypes || []).map((item: any) => ({
                  key: item.coin,
                  value: item.addr,
                }))}
                textRecords={(profile?.records?.texts || [])
                  .map((item: any) => ({ key: item.key, value: item.value }))
                  .filter((item: any) => item.value !== null)}
              />
            </DetailsWrapper>
          ),
        }}
      </Content>
    </>
  )
}

export default ProfileContent
