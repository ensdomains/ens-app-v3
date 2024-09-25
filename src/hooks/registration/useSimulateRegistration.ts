import { usePublicClient, useSimulateContract, UseSimulateContractParameters } from 'wagmi'

import { ethRegistrarControllerRegisterSnippet } from '@ensdomains/ensjs/contracts'
import { makeRegistrationTuple, RegistrationParameters } from '@ensdomains/ensjs/utils'

import { calculateValueWithBuffer } from '@app/utils/utils'

import { usePrice } from '../ensjs/public/usePrice'

type UseSimulateRegistrationParameters = Pick<UseSimulateContractParameters, 'query'> & {
  registrationParams: RegistrationParameters
}

export const useSimulateRegistration = ({
  registrationParams,
  query,
}: UseSimulateRegistrationParameters) => {
  const client = usePublicClient()

  const { data: price } = usePrice({
    nameOrNames: registrationParams.name,
    duration: registrationParams.duration,
  })

  const base = price?.base ?? 0n
  const premium = price?.premium ?? 0n
  const value = base + premium

  console.log(
    'useSimulateRegistration',
    client.chain.contracts.ensEthRegistrarController.address,
    registrationParams,
    query,
    price,
  )

  return useSimulateContract({
    abi: ethRegistrarControllerRegisterSnippet,
    address: client.chain.contracts.ensEthRegistrarController.address,
    functionName: 'register',
    args: makeRegistrationTuple(registrationParams),
    value: calculateValueWithBuffer(value),
    query,
  })
}
