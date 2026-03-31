import { Address } from 'viem'
import { usePublicClient, useSimulateContract, UseSimulateContractParameters } from 'wagmi'

import { ethRegistrarControllerRegisterSnippet } from '@ensdomains/ensjs/contracts'
import { makeRegistrationCallData, RegistrationParameters } from '@ensdomains/ensjs/utils'

import { calculateValueWithBuffer } from '@app/utils/utils'

import { usePrice } from '../ensjs/public/usePrice'

type UseSimulateRegistrationParameters = Pick<UseSimulateContractParameters, 'query'> & {
  registrationParams: RegistrationParameters
}

type UseSimulateEthRegistrarControllerRegisterReturnType = UseSimulateContractParameters<
  typeof ethRegistrarControllerRegisterSnippet,
  'register'
>

export const makeSimulateRegistrationParams = ({
  registrationParams,
  ensEthRegistrarControllerAddress,
}: {
  registrationParams: RegistrationParameters
  ensEthRegistrarControllerAddress: Address
}): UseSimulateEthRegistrarControllerRegisterReturnType => {
  return {
    abi: ethRegistrarControllerRegisterSnippet,
    address: ensEthRegistrarControllerAddress,
    functionName: 'register',
    args: [makeRegistrationCallData(registrationParams)],
  }
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

  return useSimulateContract({
    ...makeSimulateRegistrationParams({
      registrationParams,
      ensEthRegistrarControllerAddress: client.chain.contracts.ensEthRegistrarController.address,
    }),
    value: calculateValueWithBuffer(value),
    query,
  })
}
