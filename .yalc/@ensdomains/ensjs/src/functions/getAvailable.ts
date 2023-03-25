import { ENSArgs } from '..'
import { labelhash } from '../utils/labels'

const raw = async ({ contracts }: ENSArgs<'contracts'>, name: string) => {
  const baseRegistrar = await contracts?.getBaseRegistrar()!

  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== 'eth') {
    throw new Error('Currently only .eth names can be checked for availability')
  }

  return {
    to: baseRegistrar.address,
    data: baseRegistrar.interface.encodeFunctionData('available', [
      labelhash(labels[0]),
    ]),
  }
}

const decode = async ({ contracts }: ENSArgs<'contracts'>, data: string) => {
  if (data === null) return
  const baseRegistrar = await contracts?.getBaseRegistrar()!
  try {
    const result = baseRegistrar.interface.decodeFunctionResult(
      'available',
      data,
    )
    return result['0'] as boolean
  } catch {
    return
  }
}

export default {
  raw,
  decode,
}
