/* eslint-disable @typescript-eslint/no-unused-vars */
import { NameSnippet } from '@app/components/profile/NameSnippet'
import { ProfileDetails } from '@app/components/profile/ProfileDetails'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { useInitial } from '@app/hooks/useInitial'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Button } from '@ensdomains/thorin'
import { GetStaticPaths, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useEnsName, useNetwork } from 'wagmi'

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

const ProfilePage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('profile')
  const breakpoints = useBreakpoint()
  const _name = router.query.name as string
  const isSelf = _name === 'connected'

  const initial = useInitial()
  const { activeChain: chain } = useNetwork()

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
  } = useNameDetails(name)

  const isLoading =
    detailsLoading || primaryLoading || accountLoading || initial

  useProtectedRoute(
    '/',
    // When anything is loading, return true
    isLoading
      ? // if is self, user must be connected
        (isSelf ? address : true) && typeof name === 'string' && name.length > 0
      : true,
  )

  const getTextRecord = (key: string) =>
    profile?.records?.texts?.find((x) => x.key === key)

  return (
    <Content
      title={isSelf ? 'Your profile' : normalisedName}
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
            network={chain?.id!}
            ownerData={ownerData}
            expiryDate={expiryDate}
            showButton={!isSelf}
          />
        ),
        trailing: (
          <DetailsWrapper>
            <ProfileSnippet
              name={normalisedName}
              network={chain?.id!}
              url={getTextRecord('url')?.value}
              description={getTextRecord('description')?.value}
              recordName={getTextRecord('name')?.value}
              button={isSelf || breakpoints.sm ? undefined : 'viewDetails'}
            />
            {isSelf && (
              <SelfButtons>
                <Button shadowless variant="transparent" size="small">
                  Edit Profile
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
                  View Details
                </Button>
              </SelfButtons>
            )}
            <ProfileDetails
              addresses={(profile?.records?.coinTypes || []).map(
                (item: any) => ({
                  key: item.coin,
                  value: item.addr,
                }),
              )}
              textRecords={(profile?.records?.texts || [])
                .map((item: any) => ({ key: item.key, value: item.value }))
                .filter((item: any) => item.value !== null)}
            />
          </DetailsWrapper>
        ),
      }}
    </Content>
  )
}

export const getStaticProps = async () => {
  return {
    props: {},
  }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default ProfilePage
