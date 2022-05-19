import { ProfileDetails } from '@app/components/profile/ProfileDetails'
import { ProfileNftDetails } from '@app/components/profile/ProfileNftDetails'
import { SubnameDetails } from '@app/components/profile/SubnameDetails'
import { useProfile } from '@app/hooks/useProfile'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { useValidate } from '@app/hooks/useValidate'
import { Basic } from '@app/layouts/Basic'
import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useEns } from '@app/utils/EnsProvider'
import { truncateFormat } from '@ensdomains/ensjs/dist/cjs/utils/format'
import { ArrowCircleSVG, ExclamationSVG, Typography } from '@ensdomains/thorin'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import styled, { css } from 'styled-components'
import { useAccount, useEnsName, useNetwork } from 'wagmi'

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
  ${({ theme }) => `
  color: ${theme.colors.textTertiary};
  transform: rotate(180deg);
  width: ${theme.space['7']};
  height: ${theme.space['7']};
  `}
`

const BackContainer = styled.div`
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space['2']};

  &:hover {
    filter: contrast(0.8);
    transform: translateY(-1px);
  }
`

const TabButton = styled.div<{ $active: boolean }>`
  ${({ theme, $active }) => `
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  font-weight: bold;
  font-size: ${theme.fontSizes.headingThree};
  color: ${theme.colors.textTertiary};

  &:hover {
    color: ${theme.colors.textSecondary};
  }

  ${
    $active &&
    `
    color: ${theme.colors.accent};
    &:hover {
      color: ${theme.colors.accent};
    }
  `
  }
  `}
`

const TabButtonWrapper = styled(GridItem)`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: ${theme.space['1']};

    ${mq.medium.min`
      flex-direction: row;
      align-items: center;
      gap: ${theme.space['4']};
    `}
  `}
`

const WrapperGrid = styled.div<{ $hasError?: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space['8']};
  align-self: center;
  justify-content: center;
  ${({ $hasError }) => css`
    grid-template-areas: ${$hasError ? "'error error'" : ''} 'back-button tabs' 'details details' 'nft-details nft-details';
    ${mq.medium.min`
      grid-template-areas: ${
        $hasError ? "'error error'" : ''
      } "back-button tabs" "nft-details details";
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
  const isSelf = _name === '' || _name === undefined

  const [tab, setTab] = useState<'profile' | 'subnames'>('profile')
  const [error, setError] = useState<string | null>(null)

  const { activeChain: chain } = useNetwork()
  const { ready, getOwner, getExpiry, batch } = useEns()
  const { data: accountData } = useAccount()
  const address = accountData?.address

  const { data: ensName, isLoading: primaryLoading } = useEnsName({ address })

  const name = isSelf && ensName ? ensName : _name

  const { name: normalisedName, valid, labelCount } = useValidate(name, !name)

  const { profile, loading: profileLoading } = useProfile(
    normalisedName,
    !normalisedName,
  )

  const { data: batchData, isLoading: batchLoading } = useQuery(
    ['batch', 'getOwner', 'getExpiry', normalisedName],
    () =>
      labelCount > 2
        ? Promise.all([getOwner(normalisedName)])
        : batch(
            getOwner.batch(normalisedName),
            getExpiry.batch(normalisedName),
          ),
    {
      enabled: !!(normalisedName && valid),
    },
  )

  const ownerData = batchData?.[0] as Awaited<ReturnType<typeof getOwner>>
  const expiryData = batchData?.[1] as Awaited<ReturnType<typeof getExpiry>>

  const expiryDate = expiryData?.expiry

  const truncatedName = truncateFormat(normalisedName)

  const isLoading = !ready || profileLoading || batchLoading || primaryLoading

  useProtectedRoute(
    '/',
    // When anything is loading, return true
    ready
      ? // if is self, user must be connected
        (isSelf ? address : true) && typeof name === 'string' && name.length > 0
      : true,
  )

  useEffect(() => {
    if (valid && profile && profile.isMigrated && !profile.message) {
      setError(null)
    } else if (!valid) {
      setError('This name is invalid.')
    } else if (profile && !profile.isMigrated) {
      setError('This name is not migrated to the new registry.')
    } else if (profile && profile.message) {
      setError(profile.message)
    } else {
      setError('Unknown error.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid, profile?.isMigrated, profile?.message])

  useEffect(() => {
    setTab('profile')
  }, [_name])

  return (
    <Basic
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
        {!isSelf && (
          <GridItem
            style={{ alignSelf: breakpoints.md ? 'center' : 'flex-end' }}
            $area="back-button"
          >
            <BackButton />
          </GridItem>
        )}
        <TabButtonWrapper $area="tabs">
          <TabButton
            $active={tab === 'profile'}
            role="button"
            onClick={() => setTab('profile')}
          >
            {t('tabs.profile.name')}
          </TabButton>
          <TabButton
            $active={tab === 'subnames'}
            role="button"
            onClick={() => setTab('subnames')}
          >
            {t('tabs.subnames.name')}
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
              }}
            />
          )}
        </GridItem>
        <DetailsWrapper $area="details">
          {tab === 'profile' ? (
            <ProfileDetails
              name={truncatedName}
              addresses={(profile?.records?.coinTypes || []).map(
                (item: any) => ({ key: item.coin, value: item.addr }),
              )}
              textRecords={(profile?.records?.texts || [])
                .map((item: any) => ({ key: item.key, value: item.value }))
                .filter((item: any) => item.value !== null)}
              network={chain?.name || 'mainnet'}
            />
          ) : (
            <SubnameDetails
              name={normalisedName}
              network={chain?.name || 'mainnet'}
            />
          )}
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
