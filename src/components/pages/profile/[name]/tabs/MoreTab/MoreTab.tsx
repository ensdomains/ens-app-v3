import styled, { css } from 'styled-components'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useOwners from '@app/hooks/useOwners'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { validateExpiry } from '@app/utils/utils'

import Miscellaneous from './Miscellaneous/Miscellaneous'
import Ownership from './Ownership'
import Resolver from './Resolver'
import Token from './Token/Token'

const MoreContainer = styled(CacheableComponent)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    width: 100%;

    gap: ${theme.space['4']};
  `,
)

type Props = {
  name: string
  nameDetails: ReturnType<typeof useNameDetails>
  selfAbilities: ReturnType<typeof useSelfAbilities>
}

const MoreTab = ({ name, nameDetails, selfAbilities }: Props) => {
  const {
    canBeWrapped,
    ownerData,
    wrapperData,
    dnsOwner,
    isWrapped,
    basicIsCachedData,
    profileIsCachedData,
    profile,
    expiryDate,
    pccExpired,
  } = nameDetails
  const owners = useOwners({
    ownerData: ownerData!,
    wrapperData: wrapperData!,
    dnsOwner,
    selfAbilities,
  })

  return (
    <MoreContainer>
      <Miscellaneous
        expiryDate={validateExpiry(
          name,
          wrapperData,
          expiryDate || wrapperData?.expiryDate,
          pccExpired,
        )}
        name={name}
        isCachedData={basicIsCachedData}
      />
      {owners && owners.length > 0 && (
        <Ownership
          name={name}
          owners={owners}
          canSend={selfAbilities.canSend}
          canSendError={selfAbilities.canSendError}
          isCachedData={basicIsCachedData}
          isWrapped={isWrapped}
        />
      )}
      {ownerData && (
        <Token
          isWrapped={isWrapped}
          wrapperData={wrapperData}
          name={name}
          canBeWrapped={canBeWrapped}
          ownerData={ownerData}
          profile={profile}
        />
      )}
      <Resolver
        name={name}
        isWrapped={isWrapped}
        canEdit={selfAbilities.canEdit}
        canEditResolver={selfAbilities.canEditResolver}
        isCachedData={profileIsCachedData}
        resolverAddress={profile?.resolverAddress}
      />
    </MoreContainer>
  )
}

export default MoreTab
