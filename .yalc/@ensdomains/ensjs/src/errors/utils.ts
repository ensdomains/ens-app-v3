import { BaseError } from './base.js'

export class FusesOutOfRangeError extends BaseError {
  override name = 'FusesOutOfRangeError'

  constructor({
    fuses,
    minimum = 0n,
    maximum = 2n ** 32n,
    details,
  }: {
    fuses: bigint
    minimum?: bigint
    maximum?: bigint
    details?: string
  }) {
    super('Fuse value out of range', {
      metaMessages: [
        `- Fuse value: ${fuses}`,
        `- Allowed range: ${minimum}-${maximum}`,
      ],
      details,
    })
  }
}

export class FusesRestrictionNotAllowedError extends BaseError {
  override name = 'FusesRestrictionNotAllowed'

  constructor({
    fuses,
    details,
  }: {
    fuses: object | bigint
    details?: string
  }) {
    super('Restriction not allowed', {
      metaMessages: [`- Fuse value: ${fuses}`],
      details,
    })
  }
}

export class FusesInvalidFuseObjectError extends BaseError {
  override name = 'FusesInvalidFuseObjectError'

  constructor({ fuses, details }: { fuses: object; details?: string }) {
    super('Invalid fuse value', {
      metaMessages: [`- Fuse value: ${fuses}`],
      details,
    })
  }
}

export class FusesValueRequiredError extends BaseError {
  override name = 'FusesValueRequiredError'

  constructor() {
    super('Must specify at least one fuse')
  }
}

export class FusesInvalidNamedFuseError extends BaseError {
  override name = 'FusesInvalidNamedFuseError'

  constructor({ fuse }: { fuse: string }) {
    super(`${fuse} is not a valid named fuse`)
  }
}

export class FusesFuseNotAllowedError extends BaseError {
  override name = 'FusesFuseNotAllowedError'

  constructor({ fuse }: { fuse: string | bigint }) {
    super(`${fuse} is not allowed for this operation`)
  }
}

export class FusesInvalidUnnamedFuseError extends BaseError {
  override name = 'FusesInvalidUnnamedFuseError'

  constructor({ fuse }: { fuse: any }) {
    super(`${fuse} is not a valid unnamed fuse`, {
      metaMessages: [
        `- If you are trying to set a named fuse, use the named property`,
      ],
    })
  }
}

export class InvalidEncodedLabelError extends BaseError {
  override name = 'InvalidEncodedLabelError'

  constructor({ label, details }: { label: string; details?: string }) {
    super('Invalid encoded label', {
      metaMessages: [`- Supplied label: ${label}`],
      details,
    })
  }
}

export class InvalidLabelhashError extends BaseError {
  override name = 'InvalidLabelhashError'

  constructor({ labelhash, details }: { labelhash: string; details?: string }) {
    super('Invalid labelhash', {
      metaMessages: [`- Supplied labelhash: ${labelhash}`],
      details,
    })
  }
}

export class NameWithEmptyLabelsError extends BaseError {
  override name = 'NameWithEmptyLabelsError'

  constructor({ name, details }: { name: string; details?: string }) {
    super('Name cannot have empty labels', {
      metaMessages: [`- Supplied name: ${name}`],
      details,
    })
  }
}

export class RootNameIncludesOtherLabelsError extends BaseError {
  override name = 'RootNameIncludesOtherLabelsError'

  constructor({ name }: { name: string }) {
    super('Root name cannot have other labels', {
      metaMessages: [`- Supplied name: ${name}`],
    })
  }
}

export class WrappedLabelTooLargeError extends BaseError {
  override name = 'WrappedLabelTooLargeError'

  constructor({ label, byteLength }: { label: string; byteLength: number }) {
    super('Supplied label was too long', {
      metaMessages: [
        `- Supplied label: ${label}`,
        `- Max byte length: 255`,
        `- Actual byte length: ${byteLength}`,
      ],
    })
  }
}

export class CampaignReferenceTooLargeError extends BaseError {
  override name = 'CampaignReferenceTooLargeError'

  constructor({ campaign }: { campaign: number }) {
    super(`Campaign reference ${campaign} is too large`, {
      metaMessages: [`- Max campaign reference: ${0xffffffff}`],
    })
  }
}

export class InvalidContentHashError extends BaseError {
  override name = 'InvalidContentHashError'

  constructor() {
    super('Invalid content hash')
  }
}

export class UnknownContentTypeError extends BaseError {
  override name = 'UnknownContentTypeError'

  constructor({ contentType }: { contentType: string }) {
    super(`Unknown content type: ${contentType}`)
  }
}

export class ResolverAddressRequiredError extends BaseError {
  override name = 'ResolverAddressRequiredError'

  constructor({ data }: { data: object }) {
    super('Resolver address is required when data is supplied', {
      metaMessages: [
        'Supplied data:',
        ...Object.entries(data).map(([k, v]) => `- ${k}: ${v}`),
      ],
    })
  }
}
