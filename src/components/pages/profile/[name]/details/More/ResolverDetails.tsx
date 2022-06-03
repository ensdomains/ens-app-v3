/* eslint-disable @typescript-eslint/naming-convention */
import { useNetwork } from 'wagmi'

import { useProfile } from '@app/hooks/useProfile'

const RESOLVERS = {
  1: {
    DEPRECATED: [],
    OLD: [
      '0x5ffc014343cd971b7eb70732021e26c35b744cc4',
      '0x6dbc5978711cb22d7ba611bc18cec308ea12ea95',
      '0xd3ddccdd3b25a8a7423b5bee360a42146eb4baf3',
      '0x226159d592e2b063810a10ebf6dcbada94ed68b8',
    ],
  },
  3: {
    OLD: [
      '0x12299799a50340FB860D276805E78550cBaD3De3', // Ropsten
      '0x9C4c3B509e47a298544d0fD0591B47550845e903', // Ropsten
    ],
  },
  4: {
    OLD: ['0x06E6B4E68b0B9B2617b35Eec811535050999282F'],
  },
  5: {
    OLD: ['0xfF77b96d6bafCec0D684bB528b22e0Ab09C70663'],
  },
}

const OLD_RESOLVERS = [
  '0xDaaF96c344f63131acadD0Ea35170E7892d3dfBA', // all networks
]

const isResolverMigrated = (resolverAddress, networkId) =>
  ![...OLD_RESOLVERS, ...RESOLVERS[networkId].OLD].includes(resolverAddress)

const ResolverDetails = () => {
  const { profile } = useProfile('leon.eth')
  const { activeChain } = useNetwork()
  const { address } = profile

  return (
    <div>
      <p>Address: {address}</p>
      {activeChain?.id && isResolverMigrated(address, activeChain.id) ? (
        <p>Migrated</p>
      ) : (
        <p>Not migrated</p>
      )}
    </div>
  )
}

export default ResolverDetails
