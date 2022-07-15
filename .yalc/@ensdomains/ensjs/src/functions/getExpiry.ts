import { BigNumber } from 'ethers'
import { solidityKeccak256 } from 'ethers/lib/utils'
import { ENSArgs } from '..'

const raw = async (
  { contracts, multicallWrapper }: ENSArgs<'contracts' | 'multicallWrapper'>,
  name: string,
) => {
  const baseRegistrar = await contracts?.getBaseRegistrar()!

  const labels = name.split('.')

  if (labels.length > 2 || labels[1] !== 'eth') {
    throw new Error('Only .eth names have expiry dates')
  }

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

const decode = async (
  { contracts, multicallWrapper }: ENSArgs<'contracts' | 'multicallWrapper'>,
  data: string,
) => {
  if (data === null) return
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

export default {
  raw,
  decode,
}
