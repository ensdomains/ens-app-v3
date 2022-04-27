import { ProfileDetails } from '@app/components/profile/ProfileDetails'
import { ProfileNftDetails } from '@app/components/profile/ProfileNftDetails'
import { SubdomainDetails } from '@app/components/profile/SubdomainDetails'
import { useGetDomainFromInput } from '@app/hooks/useGetDomainFromInput'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Basic } from '@app/layouts/Basic'
import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useEns } from '@app/utils/EnsProvider'
import { ArrowCircleSVG, tokens, Typography } from '@ensdomains/thorin'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { useAccount, useNetwork } from 'wagmi'

const GridItem = styled.div<{ $area: string }>`
  grid-area: ${({ $area }) => $area};
`

const DetailsWrapper = styled(GridItem)`
  width: 90vw;
  max-width: 600px;

  ${mq.medium.min`
    width: 50vw;
  `}
`

const ArrowBack = styled.div`
  color: ${({ theme }) => tokens.colors[theme.mode].textTertiary};
  transform: rotate(180deg);
  width: ${tokens.space['7']};
  height: ${tokens.space['7']};
`

const BackContainer = styled.div`
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${tokens.space['2']};

  &:hover {
    filter: contrast(0.8);
    transform: translateY(-1px);
  }
`

const TabButton = styled.div<{ $active: boolean }>`
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  font-weight: bold;
  font-size: ${tokens.fontSizes.headingThree};
  color: ${({ theme }) => tokens.colors[theme.mode].textTertiary};

  &:hover {
    color: ${({ theme }) => tokens.colors[theme.mode].textSecondary};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    color: ${tokens.colors[theme.mode].accent};
    &:hover {
      color: ${tokens.colors[theme.mode].accent};
    }
  `}
`

const TabButtonWrapper = styled(GridItem)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${tokens.space['1']};

  ${mq.medium.min`
      flex-direction: row;
      align-items: center;
      gap: ${tokens.space['4']};
    `}
`

const TabWrapper = styled.div`
  background-color: ${({ theme }) => tokens.colors[theme.mode].background};
  border-radius: ${tokens.radii['2xLarge']};
`

const WrapperGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.space['4']};
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
      <ArrowBack as={ArrowCircleSVG} />
      <Typography weight="bold" color="textTertiary" variant="large">
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
  const { ready, getOwner, getExpiry, getSubnames } = useEns()
  const [
    {
      data: { ens: ensData, address } = { ens: undefined, address: undefined },
      loading: accountLoading,
    },
  ] = useAccount()

  const name = isSelf && ensData?.name ? ensData.name : _name

  const { profile, loading: profileLoading } = useGetDomainFromInput(name)
  const { data: ownerData, isLoading: ownerLoading } = useQuery(
    ['getOwner', name],
    () => getOwner(name),
  )
  const { data: expiryData, isLoading: expiryLoading } = useQuery(
    ['getExpiry', name],
    () => getExpiry(name),
  )

  const expiryDate = expiryData?.expiry

  const { data: subnameData, isLoading: subnamesLoading } = useQuery(
    ['getSubnames', name],
    () => getSubnames(name),
  )

  const isLoading =
    !ready ||
    profileLoading ||
    ownerLoading ||
    expiryLoading ||
    subnamesLoading ||
    accountLoading

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

  return (
    <Basic
      title={
        (_name === 'me' && 'Your Profile') ||
        (_name ? `${_name}'s Profile` : `Loading Profile`)
      }
      loading={isLoading}
    >
      <WrapperGrid>
        <GridItem
          style={{ alignSelf: breakpoints.md ? 'center' : 'flex-end' }}
          $area="back-button"
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
          {ownerData && expiryDate && (
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
                subdomains={subnameData || []}
                network={chain?.name || 'mainnet'}
                loading={subnamesLoading}
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
