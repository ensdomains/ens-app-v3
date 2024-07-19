import type { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

/**
 * General Verification Constants
 */
export const VERIFICATION_RECORD_KEY = 'verifications'

export const VERIFICATION_PROTOCOLS: VerificationProtocol[] = ['dentity']

export const VERIFICATION_OAUTH_BASE_URL = 'https://auth-worker-staging.ens-cf.workers.dev/v1'

/**
 * Dentity Constants
 */

const DENTITY_ENV_CONFIGS = {
  dev: {
    iss: 'https://oidc.dev.dentity.com',
    clientId: 'afl0TofdrB4B1YrEcDwNA',
    clientSecret:
      'EJ9Tw_UDrk5nahJP0W92ta5-miUy9eu7Ce3S9mbjA6NacgQduM-kl9Ww4cJplqgXwWcFMZNWIIEwFvHqypao2A',
    endpoint: 'https://oidc.dev.dentity.com',
  },
  staging: {
    iss: 'https://oidc.staging.dentity.com',
    clientId: '-IG5wkHyetFAeDziNUkdu',
    clientSecret:
      'lYFZauZV_kDA-Tc-yq4KOBx6NzfBSPnc7lJn5JIoibqjC6WD5oyELpTvLJ9UatrLxW4LLbDRUa9hKGz1ZpbU1w',
    endpoint: 'https://oidc.staging.dentity.com',
  },
} as const

type DentityEnvironment = keyof typeof DENTITY_ENV_CONFIGS

const DENTITY_ENV: DentityEnvironment = 'staging'

export const DENTITY_BASE_ENDPOINT = DENTITY_ENV_CONFIGS[DENTITY_ENV].endpoint

export const DENTITY_VPTOKEN_ENDPOINT = `${DENTITY_BASE_ENDPOINT}/oidc/vp-token`

export const DENTITY_CLIENT_ID = DENTITY_ENV_CONFIGS[DENTITY_ENV].clientId

export const DENTITY_ISS = DENTITY_ENV_CONFIGS[DENTITY_ENV].iss

// TODO: REMOVE THIS FROM THE CODEBASE
export const DENTITY_CLIENT_SECRET = DENTITY_ENV_CONFIGS[DENTITY_ENV].clientSecret

export const DENTITY_REDIRECT_URI = 'https://ens.domains'

// https://oidc.staging.dentity.com/oidc/auth?client_id=-IG5wkHyetFAeDziNUkdu&redirect_uri=https://ens.domains&response_type=code&scope=openid%20federated_token&page=ens&ens_name=davidchu.eth&eth_address=0x538E35B2888eD5bc58Cf2825D76cf6265aA4e31e
// https://receive-sms-free.cc/Free-USA-Phone-Number/16194310833/

// davidchu.eth
// https://receive-sms-free.cc/Free-USA-Phone-Number/14245875980/

// buzhidao.eth
// https://receive-sms-free.cc/Free-USA-Phone-Number/12727860655/
