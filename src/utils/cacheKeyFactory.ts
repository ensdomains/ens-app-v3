import { useAccount } from 'wagmi'

import type { uniqueTransactionIdentifierGenerator } from '@app/components/@molecules/TransactionDialogManager/stage/TransactionStageModal'
import { useChainId } from '@app/hooks/useChainId'
import type { TransactionItem } from '@app/transaction-flow/transaction'

export const useQueryKeys = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const globalKeys = [chainId, address]

  return {
    dogfood: (inputString?: string) => [...globalKeys, 'getAddr', inputString],
    transactionStageModal: {
      prepareTransaction: (
        uniqueTransactionIdentifiers: ReturnType<typeof uniqueTransactionIdentifierGenerator>,
      ) => [...globalKeys, 'prepareTx', uniqueTransactionIdentifiers],
      transactionError: (transactionHash?: string) => [...globalKeys, 'txError', transactionHash],
    },
    claimDomain: (name: string, syncWarning: boolean) => [
      ...globalKeys,
      'proverResult',
      name,
      syncWarning,
    ],
    nameSnippet: (localAddress: string) => [...globalKeys, 'getName', localAddress],
    moonpayRegistration: (currentExternalTransactionId: string) => [
      ...globalKeys,
      'currentExternalTransactionId',
      currentExternalTransactionId,
    ],
    avatar: {
      avatar: (network: number, name: string | null | undefined) => [
        ...globalKeys,
        'getAvatar',
        name,
        network,
      ],
      baseRegistrar: [...globalKeys, 'base-registrar-address'],
      getNFTImage: (name: string | null | undefined) => [...globalKeys, 'getNFTImage', name],
    },
    basicName: (normalisedName: string) => [
      ...globalKeys,
      'batch',
      'getOwner',
      'getExpiry',
      normalisedName,
    ],
    beautifiedName: (name: string) => [...globalKeys, 'beautify', name],
    blockTimestamp: [...globalKeys, 'use-block-timestamp'],
    currentBlockTimestamp: [...globalKeys, 'currentBlockTimestamp'],
    decryptName: (name: string) => [...globalKeys, 'graph', 'decryptName', name],
    getDNSOwner: (name: string) => [...globalKeys, 'getDNSOwner', name],
    getDNSProof: (name: string) => [...globalKeys, 'getDNSProof', name],
    estimateGasLimitForTransactions: (transactions: TransactionItem[], extraKeys: string[]) => [
      ...globalKeys,
      'use-estimate-gas-limit-for-transactions',
      ...transactions,
      ...extraKeys,
    ],
    estimateRegistration: [...globalKeys, 'gas-costs'],
    ethPrice: [...globalKeys, 'use-eth-price'],
    exists: (name: string) => [...globalKeys, 'getOwner', name],
    expiry: (name: string) => [...globalKeys, 'useExpiry', name],
    faucet: (localAddress?: string) => [...globalKeys, 'getFaucetEligibility', localAddress],
    getABI: (name: string) => [...globalKeys, 'useGetABI', name],
    getHistory: (name: string) => [...globalKeys, 'graph', 'getHistory', name],
    getWrapperData: (name: string) => [...globalKeys, 'getWrapperData', name],
    hasSubnames: (name: string) => [...globalKeys, 'graph', 'getSubnames', name],
    namesFromAddress: (localAddress?: string) => [...globalKeys, 'graph', 'names', localAddress],
    price: (type: 'legacy' | 'new', names: string[]) => [...globalKeys, 'usePrice', type, ...names],
    primary: (localAddress: string) => [...globalKeys, 'getName', localAddress],
    profile: (name: string) => [...globalKeys, 'garph', 'getProfile', name],
    registrationDate: (name: string) => [...globalKeys, 'garph', 'getRegistrationDate', name],
    resolver: (name: string) => [...globalKeys, 'use-resolver', name],
    resolverExists: (name: string) => [...globalKeys, 'graph', 'getResolverExists', name],
    resolverHasInterfaces: (interfaceNames: string, resolverAddress?: string) => [
      ...globalKeys,
      'validateResolver',
      resolverAddress,
      interfaceNames,
      chainId,
    ],
    resolverStatus: (
      name: string,
      options: { skip?: boolean; skipCompare?: boolean },
      profileResolverAddress?: string,
    ) => [...globalKeys, 'resolverStatus', name, { profileResolverAddress, options }],
    supportsTLD: (tld: string) => [...globalKeys, 'supportedTLD', tld],
    validate: (input: string) => [...globalKeys, 'validate', input],
    validateSubnameLabel: (validationName: string) => [
      ...globalKeys,
      'createSubname',
      'getOwner',
      validationName,
    ],
    wrapperApprovedForAll: (nameWrapperAddress: string, localAddress: string) => [
      ...globalKeys,
      'approvedForAll',
      nameWrapperAddress,
      localAddress,
    ],
    zorb: (input: string, type: string, bg: string, fg: string, accent: string) => [
      ...globalKeys,
      'zorb',
      input,
      type,
      { bg, fg, accent },
    ],
  }
}
