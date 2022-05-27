/* eslint-disable @typescript-eslint/no-unused-vars */
import { NameSnippet } from '@app/components/profile/NameSnippet'
import { ProfileDetails } from '@app/components/profile/ProfileDetails'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { useInitial } from '@app/hooks/useInitial'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Basic } from '@app/layouts/Basic'
import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Button, ExclamationSVG, Typography } from '@ensdomains/thorin'
import { GetStaticPaths, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import { useAccount, useEnsName, useNetwork } from 'wagmi'

const GridItem = styled.div<{ $area: string }>`
  grid-area: ${({ $area }) => $area};
`

const DetailsWrapper = styled(GridItem)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.space['2']};
  flex-gap: ${({ theme }) => theme.space['2']};
  width: 100%;
`

const WrapperGrid = styled.div<{ $hasError?: boolean }>`
  flex-grow: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space['5']};
  align-self: center;
  ${({ $hasError }) => css`
    grid-template-areas: ${$hasError ? "'error error'" : ''} 'details details';
    ${mq.md.min`
      grid-template-areas: ${
        $hasError ? "'error error'" : ''
      } "name-details details";
      grid-template-columns: 270px 2fr;
    `}
  `}
`

const ErrorIcon = styled.div`
  ${({ theme }) => `
    background: rgba(255, 255, 255, 0.5);
    color: ${theme.colors.yellow};
    stroke-width: ${theme.space['0.5']};
    width: max-content;
    height: max-content;
    min-height: ${theme.space['12']};
    min-width: ${theme.space['12']};
    padding: ${theme.space['1']};
    border-radius: ${theme.radii.almostExtraLarge};
  `}
`

const ErrorContainer = styled.div`
  ${({ theme }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: ${theme.space['4']};
  flex-gap: ${theme.space['4']};
  grid-area: error;
  background: rgba(${theme.accentsRaw.yellow}, 0.25);
  border-radius: ${theme.radii['2xLarge']};
  padding: ${theme.space['2']};
  padding-right: ${theme.space['8']};
  color: ${theme.colors.textSecondary};
  & > div {
    line-height: ${theme.lineHeights.normal};
  }
  `}
`

const SelfButtons = styled.div`
  display: flex;
  flex-direction: row;
  ${({ theme }) => `
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};

    & > button {
      border-radius: ${theme.radii.extraLarge};
      border: ${theme.space.px} solid ${theme.colors.borderTertiary};
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
      background-color: ${theme.colors.background};
    }
  `}
`

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
    <Basic
      heading={isSelf ? 'Your profile' : normalisedName}
      subheading={isSelf ? normalisedName : 'Profile'}
      title={
        (_name === 'me' && 'Your Profile on') ||
        (normalisedName ? `${normalisedName} on` : `Loading... -`)
      }
      loading={isLoading}
    >
      <WrapperGrid $hasError={!!error}>
        {error && (
          <ErrorContainer>
            <ErrorIcon as={ExclamationSVG} />
            <Typography variant="large" weight="bold">
              {error}
            </Typography>
          </ErrorContainer>
        )}
        {breakpoints.md && ownerData && (
          <GridItem $area="name-details">
            <NameSnippet
              name={normalisedName}
              network={chain?.name!}
              ownerData={ownerData}
              expiryDate={expiryDate}
              showButton={!isSelf}
            />
          </GridItem>
        )}
        <DetailsWrapper $area="details">
          <ProfileSnippet
            name={normalisedName}
            network={chain?.name!}
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
            addresses={(profile?.records?.coinTypes || []).map((item: any) => ({
              key: item.coin,
              value: item.addr,
            }))}
            textRecords={(profile?.records?.texts || [])
              .map((item: any) => ({ key: item.key, value: item.value }))
              .filter((item: any) => item.value !== null)}
          />
        </DetailsWrapper>
      </WrapperGrid>
    </Basic>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default ProfilePage
