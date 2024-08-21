import { encodeFunctionData, hexToBigInt } from 'viem'

import { publicClient } from '../../contracts/utils/addTestContracts'
import { legacyEthRegistrarControllerAbi } from '../constants/abis'
import { LegacyName } from '../generators/legacyNameGenerator'
import { LegacyName as LegacyNameWithConfig } from '../generators/legacyWithConfigNameGenerator'

export const getLegacyRentPrice = async ({
  label,
  duration,
}: Pick<LegacyName | LegacyNameWithConfig, 'label' | 'duration'>) => {
  const { data: price } = await publicClient.call({
    to: publicClient.chain.contracts.legacyRegistrarController.address,
    data: encodeFunctionData({
      functionName: 'rentPrice',
      abi: legacyEthRegistrarControllerAbi,
      args: [label, duration],
    }),
  })

  // Add 2% to avoid revert
  return (hexToBigInt(price!) * 102n) / 100n
}
