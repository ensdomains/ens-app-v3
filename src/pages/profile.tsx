import { ProfileDetails } from '@app/components/profile/ProfileDetails'
import { ProfileNftDetails } from '@app/components/profile/ProfileNftDetails'
import { SubdomainDetails } from '@app/components/profile/SubdomainDetails'
import { useGetDomainFromInput } from '@app/hooks/useGetDomainFromInput'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Basic } from '@app/layouts/Basic'
import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useEns } from '@app/utils/EnsProvider'
import { Box, IconArrowCircle, Typography, vars } from '@ensdomains/thorin'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { useAccount, useNetwork } from 'wagmi'

const GridItem = styled(Box)<{ $area: string }>`
  grid-area: ${({ $area }) => $area};
`

const DetailsWrapper = styled(GridItem)`
  width: 90vw;
  max-width: 600px;

  ${mq.medium.min`
    width: 50vw;
  `}
`

const ArrowBack = styled(Box)`
  color: ${vars.colors.textTertiary};
  transform: rotate(180deg);
  width: ${vars.space['7']};
  height: ${vars.space['7']};
`

const BackContainer = styled(Box)`
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${vars.space['2']};

  &:hover {
    filter: contrast(0.8);
    transform: translateY(-1px);
  }
`

const TabButton = styled(Box)<{ $active: boolean }>`
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  font-weight: bold;
  font-size: ${vars.fontSizes.headingThree};
  color: ${vars.colors.textTertiary};

  &:hover {
    color: ${vars.colors.textSecondary};
  }

  ${({ $active }) =>
    $active &&
    `
    color: ${vars.colors.accent};
    &:hover {
      color: ${vars.colors.accent};
    }
  `}
`

const TabButtonWrapper = styled(GridItem)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${vars.space['1']};

  ${mq.medium.min`
      flex-direction: row;
      align-items: center;
      gap: ${vars.space['4']};
    `}
`

const TabWrapper = styled(Box)`
  background-color: ${vars.colors.background};
  border-radius: ${vars.radii['2xLarge']};
`

const WrapperGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${vars.space['4']};
  align-self: center;
  justify-content: center;
  grid-template-areas: 'back-button tabs' 'details details' 'nft-details nft-details';
  ${mq.medium.min`
    grid-template-areas: "back-button tabs" "nft-details details";
    grid-template-columns: 270px 2fr;
  `}
`

const BackButton = () => {
  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <BackContainer role="button" onClick={() => router.back()}>
      <ArrowBack as={IconArrowCircle} />
      <Typography weight="bold" color="textTertiary" size="large">
        {t('navigation.back')}
      </Typography>
    </BackContainer>
  )
}

const ProfilePage: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation('profile')
  const breakpoints = useBreakpoint()
  const _name = router.query.name as string
  const isSelf = _name === 'me'

  const [tab, setTab] = useState<'profile' | 'subdomains'>('profile')

  const [
    {
      data: { chain },
    },
  ] = useNetwork()
  const { ready, getOwner } = useEns()
  const [
    {
      data: { ens: ensData, address } = { ens: undefined, address: undefined },
      loading: accountLoading,
    },
  ] = useAccount()

  const name = isSelf && ensData?.name ? ensData.name : _name

  const { profile, loading: profileLoading } = useGetDomainFromInput(name)
  const { data: ownerData, isLoading: ownerLoading } = useQuery(
    `getOwner-${name}`,
    () => getOwner(name),
  )

  const subdomainData: any[] = []
  const subdomainLoading = false

  // const { data: subdomainData, loading: subdomainLoading } = useQuery(
  //   GET_SUBDOMAINS_FROM_SUBGRAPH,
  //   {
  //     variables: {
  //       id: _domain && getNamehash(_domain.name),
  //     },
  //     skip: !_domain || !_domain.name,
  //   },
  // )

  useProtectedRoute(
    '/',
    // for /profile route, always redirect
    router.asPath !== '/profile' &&
      // When anything is loading, return true
      (ready
        ? // if is self, user must be connected
          (isSelf ? address : true) &&
          typeof name === 'string' &&
          name.length > 0
        : true),
  )

  useEffect(() => console.log(profile, ownerData), [profile, ownerData])

  const expiryDate = new Date()

  return (
    <Basic
      title={
        (_name === 'me' && 'Your Profile') ||
        (_name ? `${_name}'s Profile` : `Loading Profile`)
      }
      loading={!(ready && !profileLoading && !ownerLoading && !accountLoading)}
    >
      <WrapperGrid>
        <GridItem
          $area="back-button"
          alignSelf={breakpoints.md ? 'center' : 'flex-end'}
        >
          <BackButton />
        </GridItem>
        <TabButtonWrapper $area="tabs">
          <TabButton
            $active={tab === 'profile'}
            role="button"
            onClick={() => setTab('profile')}
          >
            {t('tabs.profile.name')}
          </TabButton>
          <TabButton
            $active={tab === 'subdomains'}
            role="button"
            onClick={() => setTab('subdomains')}
          >
            {t('tabs.subdomains.name')}
          </TabButton>
        </TabButtonWrapper>
        <GridItem $area="nft-details">
          {ownerData && (
            <ProfileNftDetails
              name={name}
              selfAddress={address}
              {...{
                network: chain?.name || 'mainnet',
                expiryDate,
                ownerData,
                ensData,
              }}
            />
          )}
        </GridItem>
        <DetailsWrapper $area="details">
          <TabWrapper>
            {tab === 'profile' ? (
              <ProfileDetails
                name={name}
                addresses={(profile?.records?.coinTypes || []).map(
                  (item: any) => ({ key: item.coin, value: item.addr }),
                )}
                textRecords={(profile?.records?.texts || [])
                  .map((item: any) => ({ key: item.key, value: item.value }))
                  .filter((item: any) => item.value !== null)}
                network={chain?.name || 'mainnet'}
              />
            ) : (
              <SubdomainDetails
                subdomains={subdomainData}
                network={chain?.name || 'mainnet'}
                loading={subdomainLoading}
              />
            )}
          </TabWrapper>
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

export default ProfilePage
