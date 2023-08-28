import { BigNumber } from '@ethersproject/bignumber'
import { keccak256 as solidityKeccak256 } from '@ethersproject/solidity'
import { ENSArgs } from '..'
import { namehash } from '../utils/normalise'
import { checkIsDotEth } from '../utils/validation'

type ContractOption = 'registrar' | 'nameWrapper'

type Args = {
  contract?: ContractOption
}

const getRegistrarExpiry = async (
  { contracts, multicallWrapper }: ENSArgs<'contracts' | 'multicallWrapper'>,
  labels: string[],
) => {
  if (labels.length > 2 || labels[1] !== 'eth') {
    throw new Error('Only .eth names have expiry dates on the registrar')
  }

  const baseRegistrar = await contracts?.getBaseRegistrar()!

  const expiryCall = baseRegistrar.interface.encodeFunctionData('nameExpires', [
    solidityKeccak256(['string'], [labels[0]]),
  ])
  const gracePeriodCall =
    baseRegistrar.interface.encodeFunctionData('GRACE_PERIOD')

  return multicallWrapper.raw([
    {
      to: baseRegistrar.address,
      data: expiryCall,
    },
    {
      to: baseRegistrar.address,
      data: gracePeriodCall,
    },
  ])
}

const getWrapperExpiry = async (
  { contracts }: ENSArgs<'contracts'>,
  labels: string[],
) => {
  const nameWrapper = await contracts?.getNameWrapper()!
  const expiryCall = nameWrapper.interface.encodeFunctionData('getData', [
    namehash(labels.join('.')),
  ])
  return {
    to: nameWrapper.address,
    data: expiryCall,
  }
}

const getContractToUse = (
  contract: ContractOption | undefined,
  labels: string[],
) => {
  if (contract) return contract
  if (checkIsDotEth(labels)) {
    return 'registrar'
  }
  return 'nameWrapper'
}

const raw = async (
  ensArgs: ENSArgs<'contracts' | 'multicallWrapper'>,
  name: string,
  { contract }: Args = {},
) => {
  const labels = name.split('.')

  const contractToUse = getContractToUse(contract, labels)

  return contractToUse === 'nameWrapper'
    ? getWrapperExpiry(ensArgs, labels)
    : getRegistrarExpiry(ensArgs, labels)
}

const decodeRegistrarExpiry = async (
  { contracts, multicallWrapper }: ENSArgs<'contracts' | 'multicallWrapper'>,
  data: string,
) => {
  const result = await multicallWrapper.decode(data)
  const baseRegistrar = await contracts?.getBaseRegistrar()!
  try {
    const [nameExpires] = baseRegistrar.interface.decodeFunctionResult(
      'nameExpires',
      result[0].returnData,
    )
    const [gracePeriod] = baseRegistrar.interface.decodeFunctionResult(
      'GRACE_PERIOD',
      result[1].returnData,
    )
    return {
      expiry: nameExpires > 0 ? new Date(nameExpires * 1000) : null,
      gracePeriod: (gracePeriod as BigNumber).toNumber() * 1000,
    }
  } catch {
    return
  }
}

const decodeWrapperExpiry = async (
  { contracts }: ENSArgs<'contracts'>,
  data: string,
) => {
  const nameWrapper = await contracts?.getNameWrapper()!
  try {
    const [, , expiry] = nameWrapper.interface.decodeFunctionResult(
      'getData',
      data,
    )
    return {
      expiry: new Date(expiry * 1000),
      gracePeriod: null,
    }
  } catch {
    return
  }
}

const decode = async (
  ensArgs: ENSArgs<'contracts' | 'multicallWrapper'>,
  data: string,
  name: string,
  { contract }: Args = {},
) => {
  if (data === null) return

  const labels = name.split('.')
  const contractToUse = getContractToUse(contract, labels)

  return contractToUse === 'nameWrapper'
    ? decodeWrapperExpiry(ensArgs, data)
    : decodeRegistrarExpiry(ensArgs, data)
}

export default {
  raw,
  decode,
}
