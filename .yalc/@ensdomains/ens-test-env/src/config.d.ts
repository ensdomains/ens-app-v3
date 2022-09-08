import { ConcurrentlyCommandInput } from 'concurrently'

/**
 * ens-test-env configuration object
 * @see [configuration documentation](https://github.com/ensdomains/ensjs-v3/tree/main/packages/ens-test-env/)
 */
export interface ENSTestEnvConfig {
  deployCommand?: string
  buildCommand?: string
  labelHashes?: { hash: string; label: string }[]
  scripts?: (ConcurrentlyCommandInput & {
    finishOnExit?: boolean
  })[]
  paths?: {
    data?: string
    archive?: string
    composeFile?: string
  }
}
