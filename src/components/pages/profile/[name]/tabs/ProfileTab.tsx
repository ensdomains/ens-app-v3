import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { ProfileDetails } from '@app/components/pages/profile/ProfileDetails'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProfileActions } from '@app/hooks/useProfileActions'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

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
  isSelf: boolean
  isLoading: boolean
  name: string
}

const ProfileTab = ({ nameDetails, isSelf, isLoading, name }: Props) => {
  const router = useRouter()
  const { t } = useTranslation('profile')
  const breakpoints = useBreakpoint()
  const chainId = useChainId()
  const { address } = useAccount()

  const { profile, normalisedName, profileIsCachedData } = nameDetails

  const selfAbilities = useSelfAbilities(address, name)

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

  const getTextRecord = (key: string) => profile?.records?.texts?.find((x) => x.key === key)

  const { showDataInput } = useTransactionFlow()
  const handleEditProfile = () => {
    showDataInput(
      `edit-profile-${name}`,
      'ProfileEditor',
      { name },
      { disableBackgroundClick: true },
    )
  }

  const { profileActions } = useProfileActions()

  return (
    <DetailsWrapper>
      <ProfileSnippet
        name={normalisedName}
        network={chainId}
        getTextRecord={getTextRecord}
        button={selfAbilities.canExtend ? 'extend' : undefined}
        canEdit={selfAbilities.canEdit}
        size={breakpoints.md ? 'medium' : 'small'}
        actions={profileActions}
      />
      {/* eslint-disable no-nested-ternary */}
      {selfAbilities.canEdit ? (
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
      ) : !breakpoints.md ? (
        <SelfButtons>
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
      ) : null}
      {/* eslint-enable no-nested-ternary */}
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
  )
}

export default ProfileTab
