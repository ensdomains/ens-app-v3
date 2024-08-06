import { match } from 'ts-pattern'

import { VERIFICATION_OAUTH_BASE_URL } from '@app/constants/verification'

export const getAPIEndpointForVerifier = (verifier?: string | null): string => {
  return match(verifier)
    .with('dentity', () => `${VERIFICATION_OAUTH_BASE_URL}/dentity/token`)
    .otherwise(() => '')
}
