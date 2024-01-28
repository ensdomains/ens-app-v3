import { BaseError } from './base.js'

export class DnsResponseStatusError extends BaseError {
  responseStatus: string

  override name = 'DnsResponseStatusError'

  constructor({ responseStatus }: { responseStatus: string }) {
    super(`DNS query failed with status: ${responseStatus}`)
    this.responseStatus = responseStatus
  }
}

export class DnsDnssecVerificationFailedError extends BaseError {
  record: string | undefined

  override name = 'DnsDnssecVerificationFailedError'

  constructor({ record }: { record: string | undefined }) {
    super('DNSSEC verification failed')
    this.record = record
  }
}

export class DnsNoTxtRecordError extends BaseError {
  override name = 'DnsNoTxtRecordError'

  constructor() {
    super('No TXT record found')
  }
}

export class DnsInvalidTxtRecordError extends BaseError {
  record: string

  override name = 'DnsInvalidTxtRecordError'

  constructor({ record }: { record: string }) {
    super(`Invalid TXT record: ${record}`)
    this.record = record
  }
}

export class DnsInvalidAddressChecksumError extends BaseError {
  address: string

  override name = 'DnsInvalidAddressChecksumError'

  constructor({ address }: { address: string }) {
    super(`Invalid address checksum: ${address}`)
    this.address = address
  }
}

export class DnsNewerRecordTypeAvailableError extends BaseError {
  typeCovered: string

  signatureName: string

  onchainInception: number

  dnsInception: number

  override name = 'DnsNewerRecordTypeAvailableError'

  constructor({
    typeCovered,
    signatureName,
    onchainInception,
    dnsInception,
  }: {
    typeCovered: string
    signatureName: string
    onchainInception: number
    dnsInception: number
  }) {
    super(
      `DNSSEC Oracle has a newer version of the ${typeCovered} RRSET on ${signatureName}`,
      {
        metaMessages: [
          `- Onchain inception: ${onchainInception}`,
          `- DNS inception: ${dnsInception}`,
        ],
      },
    )
    this.typeCovered = typeCovered
    this.signatureName = signatureName
    this.onchainInception = onchainInception
    this.dnsInception = dnsInception
  }
}
