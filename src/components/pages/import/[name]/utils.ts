import { Address } from 'viem'

import {
  BaseError,
  DnsDnssecVerificationFailedError,
  DnsInvalidAddressChecksumError,
  DnsInvalidTxtRecordError,
  DnsNoTxtRecordError,
  DnsResponseStatusError,
} from '@ensdomains/ensjs'
import type { GetDnsImportDataReturnType } from '@ensdomains/ensjs/dns'

import { addStateOverride } from '@app/hooks/chain/useEstimateGasWithStateOverride'
import type { UseDnsOwnerError } from '@app/hooks/ensjs/dns/useDnsOwner'
import { createTransactionItem } from '@app/transaction-flow/transaction'

export type DnsNavigationFunction = (direction: 'prev' | 'next') => void

export type DnsAddressStatus = 'matching' | 'mismatching' | null

export const checkDnsAddressMatch = ({
  address,
  dnsAddress,
}: {
  address: Address | undefined | null
  dnsAddress: Address | undefined | null
}): DnsAddressStatus => {
  if (!address || !dnsAddress) return null
  if (dnsAddress !== address) return 'mismatching' as const
  return 'matching' as const
}

export const checkDnsError = ({
  error,
  isLoading,
}: {
  error: UseDnsOwnerError | null | undefined
  isLoading: boolean
}) => {
  if (!error || isLoading) return null
  if (!(error instanceof BaseError)) return 'unknown'
  if (error instanceof DnsResponseStatusError) {
    if (error.responseStatus !== 'NXDOMAIN') return 'unknown'
    return 'noTxtRecord'
  }
  if (error instanceof DnsDnssecVerificationFailedError) return 'dnssecFailure'
  if (error instanceof DnsNoTxtRecordError) return 'noTxtRecord'
  if (error instanceof DnsInvalidTxtRecordError) return 'invalidTxtRecord'
  if (error instanceof DnsInvalidAddressChecksumError) return 'invalidAddressChecksum'
  return 'unknown'
}

export const createImportTransactionRequests = ({
  address,
  name,
  dnsOwnerStatus,
  dnsImportData,
  requiresApproval,
  publicResolverAddress,
  dnsRegistrarAddress,
}: {
  address: Address
  name: string
  dnsOwnerStatus: DnsAddressStatus
  dnsImportData: GetDnsImportDataReturnType
  requiresApproval: boolean
  publicResolverAddress: Address
  dnsRegistrarAddress: Address
}) => {
  const createApproveTx = () =>
    createTransactionItem('approveDnsRegistrar', {
      address,
    })
  const createClaimTx = () =>
    createTransactionItem('claimDnsName', {
      name,
      dnsImportData,
      address,
    })
  const createImportTx = () =>
    createTransactionItem('importDnsName', {
      name,
      dnsImportData,
    })

  if (dnsOwnerStatus === 'matching') {
    const claimTx = createClaimTx()
    if (requiresApproval) {
      const claimTxWithOverride = addStateOverride({
        item: claimTx,
        stateOverride: [
          {
            address: publicResolverAddress,
            stateDiff: [
              // `_operatorApprovals[owner][dnsRegistrarAddress] = true`
              {
                slot: 11,
                keys: [address, dnsRegistrarAddress],
                value: true,
              },
            ],
          },
        ],
      })
      const approvalTx = createApproveTx()
      return {
        transactions: [approvalTx, claimTx],
        estimators: [approvalTx, claimTxWithOverride],
      } as const
    }
    return { transactions: [claimTx] } as const
  }
  return { transactions: [createImportTx()] } as const
}
