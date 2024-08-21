import type { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

/**
 * General Verification Constants
 */

const VERIFICATION_ENV_CONFIGS = {
  staging: {
    authWorkerBaseUrl: 'https://auth-worker-staging.ens-cf.workers.dev/v1',
  },
  production: {
    authWorkerBaseUrl: 'https://auth-worker.ens-cf.workers.dev/v1',
  },
} as const

type VerificationEnv = keyof typeof VERIFICATION_ENV_CONFIGS

const VERIFICATION_ENV: VerificationEnv = 'production'

export const VERIFICATION_RECORD_KEY = 'verifications'

export const VERIFICATION_PROTOCOLS: VerificationProtocol[] = ['dentity']

export const VERIFICATION_OAUTH_BASE_URL =
  VERIFICATION_ENV_CONFIGS[VERIFICATION_ENV].authWorkerBaseUrl

/**
 * Dentity Constants
 */

const DENTITY_ENV_CONFIGS = {
  dev: {
    iss: 'https://oidc.dev.dentity.com',
    clientId: 'afl0TofdrB4B1YrEcDwNA',
    endpoint: 'https://oidc.dev.dentity.com',
    redirectUri: 'http://localhost:3000',
  },
  staging: {
    iss: 'https://oidc.staging.dentity.com',
    clientId: '-IG5wkHyetFAeDziNUkdu',
    endpoint: 'https://oidc.staging.dentity.com',
    redirectUri: 'https://dentity-integration.ens-app-v3.pages.dev',
  },
  production: {
    iss: 'https://oidc.dentity.com',
    clientId: 'TWUfWhM_hs5osk9cR4adK',
    endpoint: 'https://oidc.dentity.com',
    redirectUri: 'https://app.ens.domains',
  },
} as const

type DentityEnvironment = keyof typeof DENTITY_ENV_CONFIGS

const DENTITY_ENV: DentityEnvironment = 'production'

export const DENTITY_BASE_ENDPOINT = DENTITY_ENV_CONFIGS[DENTITY_ENV].endpoint

export const DENTITY_VPTOKEN_ENDPOINT = `${DENTITY_BASE_ENDPOINT}/oidc/vp-token`

export const DENTITY_CLIENT_ID = DENTITY_ENV_CONFIGS[DENTITY_ENV].clientId

export const DENTITY_ISS = DENTITY_ENV_CONFIGS[DENTITY_ENV].iss

export const DENTITY_REDIRECT_URI = DENTITY_ENV_CONFIGS[DENTITY_ENV].redirectUri
