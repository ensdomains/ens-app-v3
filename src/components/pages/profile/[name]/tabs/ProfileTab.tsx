import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Banner } from '@ensdomains/thorin'

import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { ProfileDetails } from '@app/components/pages/profile/ProfileDetails'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useOwners from '@app/hooks/useOwners'
import { useProfileActions } from '@app/hooks/useProfileActions'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useSubnameAbilities } from '@app/hooks/useSubnameAbilities'

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

  const {
    profile,
    normalisedName,
    profileIsCachedData,
    basicIsCachedData,
    ownerData,
    wrapperData,
    dnsOwner,
    isWrapped,
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

  const getTextRecord = (key: string) => profile?.records?.texts?.find((x) => x.key === key)

  return (
    <DetailsWrapper>
      <ProfileSnippet
        name={normalisedName}
        network={chainId}
        getTextRecord={getTextRecord}
        button={selfAbilities.canExtend ? 'extend' : undefined}
        canEdit={selfAbilities.canEdit}
      >
        {isWrapped && !normalisedName.endsWith('.eth') && (
          <Banner alert="warning">
            DNS names can be reclaimed by the DNS owner at any time. Do not purchase DNS names.
          </Banner>
        )}
      </ProfileSnippet>
      <ProfileDetails
        isCached={profileIsCachedData || basicIsCachedData || subnameAbilitiesCachedData}
        addresses={(profile?.records?.coinTypes || []).map((item: any) => ({
          key: item.coin,
          value: item.addr,
        }))}
        textRecords={(profile?.records?.texts || [])
          .map((item: any) => ({ key: item.key, value: item.value }))
          .filter((item: any) => item.value !== null)}
        owners={owners}
        actions={profileActions.profileActions}
        name={name}
      />
    </DetailsWrapper>
  )
}

export default ProfileTab
