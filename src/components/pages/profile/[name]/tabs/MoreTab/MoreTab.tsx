import styled, { css } from 'styled-components'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { getNetworkFromUrl } from '@app/constants/chains'
import type { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useNameDetails } from '@app/hooks/useNameDetails'

import { PrimaryName } from './PrimaryName'
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
}

const MoreTab = ({ name, nameDetails, abilities }: Props) => {
  const { isWrapped, isCachedData, profile } = nameDetails

  return (
    <MoreContainer>
      <Token isWrapped={isWrapped} name={name} />
      {['mainnet', 'sepolia'].includes(getNetworkFromUrl() || '') && <PrimaryName name={name} />}
      <Resolver
        name={name}
        canEdit={abilities.canEdit}
        canEditResolver={abilities.canEditResolver}
        isCachedData={isCachedData}
        resolverAddress={profile?.resolverAddress}
        canEditResolverError={abilities.canEditResolverError}
      />
    </MoreContainer>
  )
}

export default MoreTab
