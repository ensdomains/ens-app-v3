import styled, { css } from 'styled-components'
import { Hex } from 'viem'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import type { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useNameDetails } from '@app/hooks/useNameDetails'

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
  abilities: ReturnType<typeof useAbilities>['data']
  etherscanLink: string
  hasToken: boolean
  hex: Hex
  tokenId: string
}

const MoreTab = ({
  name,
  nameDetails,
  abilities,
  etherscanLink,
  hasToken,
  hex,
  tokenId,
}: Props) => {
  const { canBeWrapped, ownerData, wrapperData, isWrapped, isCachedData, profile } = nameDetails

  return (
    <MoreContainer>
      {ownerData && (
        <Token
          isWrapped={isWrapped}
          wrapperData={wrapperData}
          name={name}
          canBeWrapped={canBeWrapped}
          ownerData={ownerData}
          profile={profile}
          etherscanLink={etherscanLink}
          hasToken={hasToken}
          hex={hex}
          tokenId={tokenId}
        />
      )}
      <Resolver
        name={name}
        canEdit={abilities.canEdit}
        canEditResolver={abilities.canEditResolver}
        isCachedData={isCachedData}
        resolverAddress={profile?.resolverAddress}
      />
    </MoreContainer>
  )
}

export default MoreTab
