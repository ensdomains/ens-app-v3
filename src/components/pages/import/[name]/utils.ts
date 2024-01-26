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

export const checkDnsOwnerMatch = ({
  address,
  dnsOwner,
}: {
  address: Address | undefined | null
  dnsOwner: Address | undefined | null
}) => {
  if (!address || !dnsOwner) return null
  if (dnsOwner !== address) return 'mismatching'
  return 'matching'
}

export const checkDnsOwnerError = ({
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
