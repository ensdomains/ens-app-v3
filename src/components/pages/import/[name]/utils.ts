import { Address } from 'viem'

import {
  BaseError,
  DnsDnssecVerificationFailedError,
  DnsInvalidAddressChecksumError,
  DnsInvalidTxtRecordError,
  DnsNoTxtRecordError,
  DnsResponseStatusError,
} from '@ensdomains/ensjs'

import { UseDnsOwnerError } from '@app/hooks/ensjs/dns/useDnsOwner'

export type DnsNavigationFunction = (direction: 'prev' | 'next') => void

export const checkDnsAddressMatch = ({
  address,
  dnsAddress,
}: {
  address: Address | undefined | null
  dnsAddress: Address | undefined | null
}) => {
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
