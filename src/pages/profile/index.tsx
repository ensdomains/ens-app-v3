/* eslint-disable @typescript-eslint/no-unused-vars */
import { NameSnippet } from '@app/components/pages/profile/NameSnippet'
import { ProfileDetails } from '@app/components/pages/profile/ProfileDetails'
import ProfileEditor from '@app/components/pages/profile/ProfileEditor/ProfileEditor'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { useChainId } from '@app/hooks/useChainId'
import { useInitial } from '@app/hooks/useInitial'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { makeIntroItem } from '@app/transaction-flow/intro'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { GenericTransaction } from '@app/transaction-flow/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Button } from '@ensdomains/thorin'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useEnsName } from 'wagmi'

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

const SelfButtons = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};

    & > button {
      border-radius: ${theme.radii.extraLarge};
      border: ${theme.space.px} solid ${theme.colors.borderTertiary};
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
      background-color: ${theme.colors.background};
    }
  `,
)

export default function Page() {
  const router = useRouter()
  const { t } = useTranslation('profile')
  const breakpoints = useBreakpoint()
  const _name = router.query.name as string
  const isSelf = router.query.connected === 'true'

  const initial = useInitial()
  const chainId = useChainId()

  const { data: accountData, isLoading: accountLoading } = useAccount()
  const address = accountData?.address

  const { data: ensName, isLoading: primaryLoading } = useEnsName({ address })

  const name = isSelf && ensName ? ensName : _name

  const {
    isLoading: detailsLoading,
    error,
    profile,
    ownerData,
    expiryDate,
    normalisedName,
    dnsOwner,
    valid,
  } = useNameDetails(name)

  const selfAbilities = useSelfAbilities(address, ownerData)

  const { createTransactionFlow } = useTransactionFlow()

  const isLoading = detailsLoading || primaryLoading || accountLoading || initial

  useProtectedRoute(
    '/',
    // When anything is loading, return true
    isLoading
      ? true
      : // if is self, user must be connected
        (isSelf ? address : true) && typeof name === 'string' && name.length > 0,
  )

  const getTextRecord = (key: string) => profile?.records?.texts?.find((x) => x.key === key)

  const [showEditor, setShowEditor] = useState(true)
  const handleDismissEditor = () => setShowEditor(false)

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

  const profileActions = useMemo(() => {
    if (isSelf || (!selfAbilities.canEdit && profile?.address !== address)) return undefined
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
    return [
      {
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
      },
    ]
  }, [isSelf, selfAbilities.canEdit, name, address, profile?.address, t, createTransactionFlow])

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
            />
          ),
          trailing: (
            <DetailsWrapper>
              <ProfileSnippet
                name={normalisedName}
                network={chainId}
                url={getTextRecord('url')?.value}
                description={getTextRecord('description')?.value}
                recordName={getTextRecord('name')?.value}
                button={isSelf || breakpoints.md ? undefined : 'viewDetails'}
                size={breakpoints.md ? 'medium' : 'small'}
                actions={profileActions}
              />
              {selfAbilities.canEdit && (
                <SelfButtons>
                  <Button
                    shadowless
                    variant="transparent"
                    size="small"
                    onClick={() => setShowEditor(true)}
                  >
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
                addresses={(profile?.records?.coinTypes || []).map((item: any) => ({
                  key: item.coin,
                  value: item.addr,
                }))}
                textRecords={(profile?.records?.texts || [])
                  .map((item: any) => ({ key: item.key, value: item.value }))
                  .filter((item: any) => item.value !== null)}
              />

              {selfAbilities.canEdit && (
                <ProfileEditor name={name} open={showEditor} onDismiss={handleDismissEditor} />
              )}
            </DetailsWrapper>
          ),
        }}
      </Content>
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
