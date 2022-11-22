import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { ProfileDetails } from '@app/components/pages/profile/ProfileDetails'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'

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

  const { profile, normalisedName, profileIsCachedData, basicIsCachedData } = nameDetails

  const selfAbilities = useSelfAbilities(address, name)

  const getTextRecord = (key: string) => profile?.records?.texts?.find((x) => x.key === key)

  return (
    <DetailsWrapper>
      <ProfileSnippet
        name={normalisedName}
        network={chainId}
        getTextRecord={getTextRecord}
        button={selfAbilities.canExtend ? 'extend' : undefined}
        canEdit={selfAbilities.canEdit}
      />
      <ProfileDetails
        isCached={profileIsCachedData || basicIsCachedData}
        addresses={(profile?.records?.coinTypes || []).map((item: any) => ({
          key: item.coin,
          value: item.addr,
        }))}
        textRecords={(profile?.records?.texts || [])
          .map((item: any) => ({ key: item.key, value: item.value }))
          .filter((item: any) => item.value !== null)}
        name={normalisedName}
      />
    </DetailsWrapper>
  )
}

export default ProfileTab
