import type { NameType } from '../types.js'
import { BaseError } from './base.js'

export class AdditionalParameterSpecifiedError extends BaseError {
  parameter: string

  allowedParameters: string[]

  override name = 'AdditionalParameterSpecifiedError'

  constructor({
    parameter,
    allowedParameters,
    details,
  }: {
    parameter: string
    allowedParameters: string[]
    details?: string
  }) {
    super(`Additional parameter specified: ${parameter}`, {
      metaMessages: [`- Allowed parameters: ${allowedParameters.join(', ')}`],
      details,
    })
    this.parameter = parameter
    this.allowedParameters = allowedParameters
  }
}

export class RequiredParameterNotSpecifiedError extends BaseError {
  parameter: string

  override name = 'RequiredParameterNotSpecifiedError'

  constructor({ parameter, details }: { parameter: string; details?: string }) {
    super(`Required parameter not specified: ${parameter}`, { details })
    this.parameter = parameter
  }
}

export class UnsupportedNameTypeError extends BaseError {
  nameType: NameType

  supportedTypes: NameType[]

  override name = 'UnsupportedNameTypeError'

  constructor({
    nameType,
    supportedNameTypes,
    details,
  }: {
    nameType: NameType
    supportedNameTypes: NameType[]
    details?: string
  }) {
    super(`Unsupported name type: ${nameType}`, {
      metaMessages: [
        `- Supported name types: ${supportedNameTypes.join(', ')}`,
      ],
      details,
    })
    this.nameType = nameType
    this.supportedTypes = supportedNameTypes
  }
}

export class InvalidContractTypeError extends BaseError {
  contractType: string

  supportedTypes: string[]

  override name = 'InvalidContractTypeError'

  constructor({
    contractType,
    supportedContractTypes,
    details,
  }: {
    contractType: string
    supportedContractTypes: string[]
    details?: string
  }) {
    super(`Invalid contract type: ${contractType}`, {
      metaMessages: [
        `- Supported contract types: ${supportedContractTypes.join(', ')}`,
      ],
      details,
    })
    this.contractType = contractType
    this.supportedTypes = supportedContractTypes
  }
}
