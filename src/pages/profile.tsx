import { gql, useQuery } from '@apollo/client'
import { ProfileDetails } from '@app/components/profile/ProfileDetails'
import { ProfileNftDetails } from '@app/components/profile/ProfileNftDetails'
import { SubdomainDetails } from '@app/components/profile/SubdomainDetails'
import { GET_SUBDOMAINS_FROM_SUBGRAPH } from '@app/graphql/queries'
import { useGetDomainFromInput } from '@app/hooks/useGetDomainFromInput'
import { useGetRecords } from '@app/hooks/useGetRecords'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Basic } from '@app/layouts/Basic'
import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { ArrowCircleSVG, tokens, Typography } from '@ensdomains/thorin'
import { getNamehash } from '@ensdomains/ui'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    isENSReady
    isAppReady
    network
    accounts
    primaryName
    isReadOnly
  }
`

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

  const [domain, setDomain] = useState<any>(undefined)
  const [tab, setTab] = useState<'profile' | 'subdomains'>('profile')

  const {
    data: {
      isENSReady,
      isAppReady,
      network,
      accounts,
      primaryName,
      isReadOnly,
    },
  } = useQuery(NETWORK_INFORMATION_QUERY)

  const name = isSelf ? primaryName : _name

  const { domain: _domain, loading: domainLoading } =
    useGetDomainFromInput(name)
  const { dataAddresses, dataTextRecords, recordsLoading } =
    useGetRecords(_domain)

  const { data: subdomainData, loading: subdomainLoading } = useQuery(
    GET_SUBDOMAINS_FROM_SUBGRAPH,
    {
      variables: {
        id: _domain && getNamehash(_domain.name),
      },
      skip: !_domain || !_domain.name,
    },
  )

  useProtectedRoute(
    '/',
    // for /profile route, always redirect
    router.asPath !== '/profile' &&
      // When anything is loading, return true
      (network !== 'Loading' && isENSReady && isAppReady
        ? // if is self, user must be connected
          (isSelf ? !isReadOnly : true) &&
          typeof name === 'string' &&
          name.length > 0
        : true),
  )

  const expiryDate = domain && domain.expiryTime && (domain.expiryTime as Date)

  useEffect(() => {
    const timeout = _domain && setTimeout(() => setDomain(_domain), 100)
    return () => clearTimeout(timeout)
  }, [_domain])

  return (
    <Basic
      title={
        (_name === 'me' && 'Your Profile') ||
        (domain && domain.name ? `${_name}'s Profile` : `Loading Profile`)
      }
      loading={
        !(
          network &&
          network !== 'Loading' &&
          domain &&
          domain.name &&
          !domainLoading &&
          !recordsLoading
        )
      }
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
          <ProfileNftDetails
            name={name}
            selfAddress={accounts?.[0]}
            {...{ network, expiryDate, domain }}
          />
        </GridItem>
        <DetailsWrapper $area="details">
          <TabWrapper>
            {tab === 'profile' ? (
              <ProfileDetails
                name={name}
                addresses={dataAddresses && dataAddresses.getAddresses}
                textRecords={dataTextRecords && dataTextRecords.getTextRecords}
                network={network}
              />
            ) : (
              <SubdomainDetails
                subdomains={subdomainData?.domain?.subdomains}
                network={network}
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
