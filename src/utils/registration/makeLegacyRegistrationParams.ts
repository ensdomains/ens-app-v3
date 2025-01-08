import { Address } from 'viem'

import { LegacyRegistrationParameters, RegistrationParameters } from '@ensdomains/ensjs/utils'

import { isEthCoin } from '../coin'
import { emptyAddress } from '../constants'

export const makeLegacyRegistrationParams = ({
  name,
  owner,
  records,
  duration,
  secret,
  resolverAddress = emptyAddress,
}: RegistrationParameters): LegacyRegistrationParameters => {
  if (resolverAddress === emptyAddress)
    return {
      name,
      owner,
      duration,
      secret,
    }

  const address = (records?.coins?.find(({ coin }) => isEthCoin(coin))?.value as Address) || owner

  return {
    name,
    owner,
    duration,
    secret,
    resolverAddress,
    address,
  }
}
