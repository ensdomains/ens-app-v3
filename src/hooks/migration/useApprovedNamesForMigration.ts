import { Address, erc721Abi } from 'viem'
import { usePublicClient, useReadContracts } from 'wagmi'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { NameWithRelation } from '@ensdomains/ensjs/subgraph'

import { migrationHelperContract } from '@app/migration/migrationHelper'

export const useApprovedNamesForMigration = ({
  names,
  owner,
}: {
  names: NameWithRelation[]
  owner?: Address
}): NameWithRelation[] => {
  const client = usePublicClient()

  const { data } = useReadContracts({
    contracts: names.map((name) => ({
      address: getChainContractAddress({
        client,
        contract: name.wrappedOwner ? 'ensNameWrapper' : 'ensBaseRegistrarImplementation',
      }),
      abi: erc721Abi,
      functionName: 'isApprovedForAll',
      args: [owner, migrationHelperContract[client.chain.id]],
    })),
    multicallAddress: getChainContractAddress({ client, contract: 'multicall3' }),
  })

  return names.filter((d, i) => Boolean(data?.[i].result))
}
