import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Helper } from '@ensdomains/thorin'

import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { ProfileDetails } from '@app/components/pages/profile/ProfileDetails'
import { useChainId } from '@app/hooks/useChainId'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useOwners from '@app/hooks/useOwners'
import { useProfileActions } from '@app/hooks/useProfileActions'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useSubnameAbilities } from '@app/hooks/useSubnameAbilities'
import { validateExpiry } from '@app/utils/utils'

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

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  name: string
}

const ProfileTab = ({ nameDetails, name }: Props) => {
  const chainId = useChainId()
  const { address } = useAccount()
  const { t } = useTranslation('profile')

  const {
    profile,
    normalisedName,
    profileIsCachedData,
    basicIsCachedData,
    ownerData,
    wrapperData,
    expiryDate,
    dnsOwner,
    isWrapped,
    gracePeriodEndDate,
  } = nameDetails

  const selfAbilities = useSelfAbilities(address, name)
  const { abilities: subnameAbilities, isCachedData: subnameAbilitiesCachedData } =
    useSubnameAbilities({ address, name, ownerData, wrapperData })

  const owners = useOwners({
    ownerData: ownerData!,
    wrapperData: wrapperData!,
    dnsOwner,
    selfAbilities,
  })
  const profileActions = useProfileActions({
    address,
    name,
    profile,
    selfAbilities,
    subnameAbilities,
  })

  const nameWrapperAddress = useContractAddress('NameWrapper')
  const isExpired = useMemo(
    () => gracePeriodEndDate && gracePeriodEndDate < new Date(),
    [gracePeriodEndDate],
  )
  const snippetButton = useMemo(() => {
    if (isExpired) return 'register'
    if (selfAbilities.canExtend) return 'extend'
  }, [isExpired, selfAbilities.canExtend])

  const getTextRecord = (key: string) => profile?.records?.texts?.find((x) => x.key === key)

  const pccExpired =
    owners.length === 1 &&
    owners[0].address === nameWrapperAddress &&
    wrapperData?.expiryDate &&
    wrapperData.expiryDate < new Date()

  return (
    <DetailsWrapper>
      <ProfileSnippet
        name={normalisedName}
        network={chainId}
        getTextRecord={getTextRecord}
        button={snippetButton}
        canEdit={selfAbilities.canEdit}
      >
        {isWrapped && !normalisedName.endsWith('.eth') && (
          <Helper type="warning" alignment="horizontal">
            {t('tabs.profile.warnings.wrappedDNS')}
          </Helper>
        )}
      </ProfileSnippet>
      <ProfileDetails
        expiryDate={validateExpiry(
          normalisedName,
          wrapperData,
          expiryDate || wrapperData?.expiryDate,
          pccExpired,
        )}
        pccExpired={!!pccExpired}
        isCached={profileIsCachedData || basicIsCachedData || subnameAbilitiesCachedData}
        addresses={(profile?.records?.coinTypes || []).map((item: any) => ({
          key: item.coin,
          value: item.addr,
        }))}
        textRecords={(profile?.records?.texts || [])
          .map((item: any) => ({ key: item.key, value: item.value }))
          .filter((item: any) => item.value !== null)}
        owners={owners}
        name={normalisedName}
        actions={profileActions.profileActions}
      />
    </DetailsWrapper>
  )
}

export default ProfileTab
