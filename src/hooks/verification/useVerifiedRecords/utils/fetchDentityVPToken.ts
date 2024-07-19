/* eslint-disable @typescript-eslint/naming-convention */

import { DENTITY_VPTOKEN_ENDPOINT } from '@app/constants/verification'

import type { VerifiedRecord } from '../useVerifiedRecords'
import { parseVPToken } from './parseVPToken'

export type DentityVPTokenReturnType = {
  ens_name: string
  eth_address: string
  vp_token: {
    credentialSubject: {
      credentialSubject: string
      [key: string]: string
    }
  }[]
}

export const fetchDentityVPToken = async ({
  federatedToken,
  address,
  name,
}: {
  federatedToken: string
  address: string
  name: string
}): Promise<VerifiedRecord> => {
  const url = new URL(DENTITY_VPTOKEN_ENDPOINT)
  url.searchParams.append('federated_token', federatedToken)
  url.searchParams.append('ens_name', name)
  // url.searchParams.append('eth_address', address)

  const resp = await fetch(url.toString())
  const json = await resp.json()

  console.log('json', json)
  const { ens_name, eth_address, vp_token } = json as DentityVPTokenReturnType

  const isNameVerified = !!ens_name && !!name && ens_name === name
  const isAddressVerified =
    !!eth_address && !!address && address.toLowerCase() === eth_address.toLowerCase()
  const isVerified = isNameVerified && isAddressVerified
  const verifiedRecords = parseVPToken(vp_token)

  return {
    verifier: 'dentity',
    isVerified,
    isNameVerified,
    isAddressVerified,
    verifiedRecords,
  }
}
