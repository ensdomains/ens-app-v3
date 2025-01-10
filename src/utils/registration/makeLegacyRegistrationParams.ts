import { Address } from 'viem'

import {
  LegacyRegistrationWithConfigParameters,
  RegistrationParameters,
} from '@ensdomains/ensjs/utils'

import { isEthCoin } from '../coin'
import { emptyAddress } from '../constants'

export const makeLegacyRegistrationParams = ({
  name,
  owner,
  records,
  duration,
  secret,
  resolverAddress = emptyAddress,
}: RegistrationParameters): LegacyRegistrationWithConfigParameters => {
  const address = (records?.coins?.find(({ coin }) => isEthCoin(coin))?.value as Address) || owner

  return {
    name,
    owner,
    duration,
    secret,
    resolverAddress,
    address,
  } as LegacyRegistrationWithConfigParameters
}
