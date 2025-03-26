import { getVersion } from './error-utils.js'

type BaseErrorParameters = {
  metaMessages?: string[]
} & (
  | {
      cause?: never
      details?: string
    }
  | {
      cause: BaseError | Error
      details?: never
    }
)

export class BaseError extends Error {
  details: string

  metaMessages?: string[]

  shortMessage: string

  override name = 'EnsJsError'

  version = getVersion()

  constructor(shortMesage: string, args: BaseErrorParameters = {}) {
    super()

    const details =
      args.cause instanceof BaseError
        ? args.cause.details
        : args.cause?.message ?? args.details!

    this.message = [
      shortMesage || 'An error occurred',
      '',
      ...(args.metaMessages ? [...args.metaMessages, ''] : []),
      ...(details ? [`Details: ${details}`, ''] : []),
      `Version: ${this.version}`,
    ].join('\n')

    if (args.cause) this.cause = args.cause
    this.details = details
    this.metaMessages = args.metaMessages
    this.shortMessage = shortMesage
  }
}
