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
      transactionError: (transactionHash?: string) => [
        ...globalKeys,
        transactionHash,
        'transactionError',
      ],
    },
    nameSnippet: (localAddress: string) => [...globalKeys, 'getName', localAddress, 'nameSnippet'],
    moonpayRegistration: (currentExternalTransactionId: string) => [
      ...globalKeys,
      'currentExternalTransactionId',
      currentExternalTransactionId,
      'moonpayRegistration',
    ],
    avatar: {
      avatar: (name: string | null | undefined) => [...globalKeys, 'getAvatar', name, 'avatar'],
      getNFTImage: (name: string | null | undefined) => [...globalKeys, name, 'getNFTImage'],
    },
    basicName: (normalisedName: string, registrationStepIndex: number) => [
      ...globalKeys,
      'batch',
      'getOwner',
      'getExpiry',
      normalisedName,
      registrationStepIndex,
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
      'getNames',
      localAddress,
      'namesFromAddress',
    ],
    getPrice: (type: 'legacy' | 'new', names: string[]) => [
      ...globalKeys,
      type,
      ...names,
      'getPrice',
    ],
    primary: (localAddress: string) => [...globalKeys, 'getName', localAddress, 'primary'],
    profile: (name: string, resolverAddress?: string) => [
      ...globalKeys,
      'graph',
      name,
      'profile',
      resolverAddress,
    ],
    registrationDate: (name: string) => [...globalKeys, 'graph', name, 'registrationDate'],
    getResolver: (name: string) => [...globalKeys, name, 'getResolver'],
    resolverExists: (name: string) => [
      ...globalKeys,
      'graph',
      'getResolver',
      name,
      'resolverExists',
    ],
    resolverHasInterfaces: (interfaceNames: string, resolverAddress?: string) => [
      ...globalKeys,
      'validateResolver',
      resolverAddress,
      interfaceNames,
      'resolverHasInterfaces',
    ],
    resolverIsAuthorized: (name: string, resolver: string) => [
      ...globalKeys,
      'resolverIsAuthorised',
      name,
      resolver,
    ],
    resolverStatus: (
      name: string,
      options: { skip?: boolean; skipCompare?: boolean },
      profileResolverAddress?: string,
    ) => [...globalKeys, name, { profileResolverAddress, options }, 'resolverStatus'],
    isSupportedTLD: (tld: string) => [...globalKeys, tld, 'isSupportedTLD'],
    validate: (input: string) => [...globalKeys, input, 'validate'],
    validateSubnameLabel: (validationName: string) => [
      ...globalKeys,
      'createSubname',
      'getOwner',
      validationName,
      'validateSubnameLabel',
    ],
    wrapperApprovedForAll: (localAddress: string) => [
      ...globalKeys,
      localAddress,
      'wrapperApprovedForAll',
    ],
    globalIndependent: {
      zorb: (input: string, type: string, bg: string, fg: string, accent: string) => [
        input,
        type,
        { bg, fg, accent },
        'zorb',
      ],
      gasCostJson: ['gasCostJson'],
      claimDomain: (name: string, syncWarning: boolean) => [
        'proverResult',
        name,
        syncWarning,
        'claimDomain',
      ],
    },
  }
}
