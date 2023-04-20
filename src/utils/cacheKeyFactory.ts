import { useAccount } from 'wagmi'

import type { uniqueTransactionIdentifierGenerator } from '@app/components/@molecules/TransactionDialogManager/stage/TransactionStageModal'
import { useChainId } from '@app/hooks/useChainId'
import type { RegistrationProps } from '@app/hooks/useEstimateRegistration'
import type { TransactionItem } from '@app/transaction-flow/transaction'

export const useQueryKeys = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const globalKeys = [chainId, address]

  return {
    dogfood: (inputString?: string) => [...globalKeys, 'getAddr', inputString, 'dogfood'],
    transactionStageModal: {
      prepareTransaction: (
        uniqueTransactionIdentifiers: ReturnType<typeof uniqueTransactionIdentifierGenerator>,
      ) => [...globalKeys, uniqueTransactionIdentifiers, 'prepareTransaction'],
      getTransactionError: (transactionHash?: string) => [
        ...globalKeys,
        transactionHash,
        'transactionError',
      ],
    },
    claimDomain: (name: string, syncWarning: boolean) => [
      ...globalKeys,
      'proverResult',
      name,
      syncWarning,
      'claimDomain',
    ],
    nameSnippet: (localAddress: string) => [...globalKeys, 'getName', localAddress, 'nameSnippet'],
    moonpayRegistration: (currentExternalTransactionId: string) => [
      ...globalKeys,
      'currentExternalTransactionId',
      currentExternalTransactionId,
      'moonpayRegistration',
    ],
    avatar: {
      avatar: (network: number, name: string | null | undefined) => [
        ...globalKeys,
        'getAvatar',
        name,
        network,
        'avatar',
      ],
      baseRegistrar: [...globalKeys, 'base-registrar-address', 'baseRegistrar'],
      getNFTImage: (name: string | null | undefined) => [...globalKeys, name, 'getNFTImage'],
    },
    basicName: (normalisedName: string) => [
      ...globalKeys,
      'batch',
      'getOwner',
      'getExpiry',
      normalisedName,
      'basicName',
    ],
    beautifiedName: (name: string) => [...globalKeys, name, 'beautifiedName'],
    blockTimestamp: [...globalKeys, 'blockTimestamp'],
    currentBlockTimestamp: [...globalKeys, 'currentBlockTimestamp'],
    decryptName: (name: string) => [...globalKeys, 'graph', name, 'decryptName'],
    getDNSOwner: (name: string) => [...globalKeys, name, 'getDNSOwner'],
    getDNSProof: (name: string) => [...globalKeys, name, 'getDNSProof'],
    estimateGasLimitForTransactions: (transactions: TransactionItem[], extraKeys: string[]) => [
      ...globalKeys,
      ...transactions,
      ...extraKeys,
      'estimateGasLimitForTransactions',
    ],
    estimateRegistration: (data?: RegistrationProps) => [
      ...globalKeys,
      data,
      'estimateRegistration',
    ],
    ethPrice: [...globalKeys, 'ethPrice'],
    exists: (name: string) => [...globalKeys, 'getOwner', name, 'exists'],
    expiry: (name: string) => [...globalKeys, 'useExpiry', name, 'expiry'],
    faucet: (localAddress?: string) => [...globalKeys, localAddress, 'faucet'],
    getABI: (name: string) => [...globalKeys, name, 'getABI'],
    getHistory: (name: string) => [...globalKeys, 'graph', name, 'getHistory'],
    getWrapperData: (name: string) => [...globalKeys, name, 'getWrapperData'],
    hasSubnames: (name: string) => [...globalKeys, 'graph', name, 'hasSubnames'],
    namesFromAddress: (localAddress?: string) => [
      ...globalKeys,
      'graph',
      'names',
      localAddress,
      'namesFromAddress',
    ],
    price: (type: 'legacy' | 'new', names: string[]) => [...globalKeys, type, ...names, 'price'],
    primary: (localAddress: string) => [...globalKeys, 'getName', localAddress, 'primary'],
    profile: (name: string) => [...globalKeys, 'garph', name, 'profile'],
    registrationDate: (name: string) => [...globalKeys, 'garph', name, 'registrationDate'],
    resolver: (name: string) => [...globalKeys, name, 'resolver'],
    resolverExists: (name: string) => [...globalKeys, 'graph', name, 'resolverExists'],
    resolverHasInterfaces: (interfaceNames: string, resolverAddress?: string) => [
      ...globalKeys,
      'validateResolver',
      resolverAddress,
      interfaceNames,
      chainId,
      'resolverHasInterfaces',
    ],
    resolverStatus: (
      name: string,
      options: { skip?: boolean; skipCompare?: boolean },
      profileResolverAddress?: string,
    ) => [...globalKeys, name, { profileResolverAddress, options }, 'resolverStatus'],
    supportsTLD: (tld: string) => [...globalKeys, tld, 'supportedTLD'],
    validate: (input: string) => [...globalKeys, input, 'validate'],
    validateSubnameLabel: (validationName: string) => [
      ...globalKeys,
      'createSubname',
      'getOwner',
      validationName,
      'validateSubnameLabel',
    ],
    wrapperApprovedForAll: (nameWrapperAddress: string, localAddress: string) => [
      ...globalKeys,
      nameWrapperAddress,
      localAddress,
      'wrapperApprovedForAll',
    ],
    zorb: (input: string, type: string, bg: string, fg: string, accent: string) => [
      ...globalKeys,
      input,
      type,
      { bg, fg, accent },
      'zorb',
    ],
  }
}
