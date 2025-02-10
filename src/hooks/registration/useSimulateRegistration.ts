import { Address } from 'viem'
import { usePublicClient, useSimulateContract, UseSimulateContractParameters } from 'wagmi'

import {
  ethRegistrarControllerRegisterSnippet,
  legacyEthRegistrarControllerRegisterWithConfigSnippet,
} from '@ensdomains/ensjs/contracts'
import {
  makeLegacyRegistrationWithConfigTuple,
  makeRegistrationTuple,
  RegistrationParameters,
} from '@ensdomains/ensjs/utils'

import { isLegacyRegistration } from '@app/utils/registration/isLegacyRegistration'
import { makeLegacyRegistrationParams } from '@app/utils/registration/makeLegacyRegistrationParams'
import { calculateValueWithBuffer } from '@app/utils/utils'

import { usePrice } from '../ensjs/public/usePrice'

type UseSimulateRegistrationParameters = Pick<UseSimulateContractParameters, 'query'> & {
  registrationParams: RegistrationParameters
}

type UseSimulateEthRegistrarControllerRegisterReturnType = UseSimulateContractParameters<
  typeof ethRegistrarControllerRegisterSnippet,
  'register'
>

type UseSimulateLegacyEthRegistrarControllerRegisterReturnType = UseSimulateContractParameters<
  typeof legacyEthRegistrarControllerRegisterWithConfigSnippet,
  'registerWithConfig'
>

type MakeSimulateRegistrationParamsReturnType =
  | UseSimulateEthRegistrarControllerRegisterReturnType
  | UseSimulateLegacyEthRegistrarControllerRegisterReturnType

export const makeSimulateRegistrationParams = ({
  registrationParams,
  ensEthRegistrarControllerAddress,
  legacyEthRegistrarControllerAddress,
}: {
  registrationParams: RegistrationParameters
  ensEthRegistrarControllerAddress: Address
  legacyEthRegistrarControllerAddress: Address
}): MakeSimulateRegistrationParamsReturnType => {
  if (isLegacyRegistration(registrationParams)) {
    return {
      abi: legacyEthRegistrarControllerRegisterWithConfigSnippet,
      address: legacyEthRegistrarControllerAddress,
      functionName: 'registerWithConfig',
      args: makeLegacyRegistrationWithConfigTuple(makeLegacyRegistrationParams(registrationParams)),
    }
  }

  return {
    abi: ethRegistrarControllerRegisterSnippet,
    address: ensEthRegistrarControllerAddress,
    functionName: 'register',
    args: makeRegistrationTuple(registrationParams),
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
      legacyEthRegistrarControllerAddress:
        client.chain.contracts.legacyEthRegistrarController.address,
    }),
    value: calculateValueWithBuffer(value),
    query,
  })
}
