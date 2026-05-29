import { Address, keccak256, parseAbi, toBytes } from 'viem'
import { useReadContract } from 'wagmi'

import { deploymentAddresses } from '@app/constants/chains'

const controllerAddress = deploymentAddresses.ETHRegistrarController as Address | undefined

const reservedAbi = parseAbi([
  'function reservedNames(bytes32) view returns (bool)',
])

/**
 * Reads `SimplexController.reservedNames(keccak256(label))` for a fully-qualified
 * name (the `.testing` / `.simplex` suffix is stripped before hashing).
 */
export const useReservedStatus = ({ name }: { name?: string }) => {
  const label = name ? name.split('.')[0] : ''
  const enabled =
    !!controllerAddress &&
    controllerAddress !== '0x0000000000000000000000000000000000000000' &&
    !!label

  const { data, isLoading } = useReadContract({
    address: enabled ? controllerAddress! : undefined,
    abi: reservedAbi,
    functionName: 'reservedNames',
    args: enabled ? [keccak256(toBytes(label))] : undefined,
    query: { enabled, staleTime: 30_000 },
  })

  return {
    isReserved: data === true,
    loaded: enabled ? !isLoading : true,
  }
}
