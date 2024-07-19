import { Hash } from 'viem'

import {
  DENTITY_BASE_ENDPOINT,
  DENTITY_CLIENT_ID,
  DENTITY_REDIRECT_URI,
} from '@app/constants/verification'

export const createDentityUrl = ({ name, address }: { name: string; address: Hash }) => {
  const url = new URL(`${DENTITY_BASE_ENDPOINT}/oidc/auth`)
  url.searchParams.set('client_id', DENTITY_CLIENT_ID)
  url.searchParams.set('redirect_uri', DENTITY_REDIRECT_URI)
  url.searchParams.set('scope', 'openid federated_token')
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('ens_name', name)
  url.searchParams.set('eth_address', address)
  url.searchParams.set('page', 'ens')
  return url.toString()
}
