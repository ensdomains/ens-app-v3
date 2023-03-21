import { ENSArgs } from '../index'
import { namehash } from './normalise'

export const makeResolver = async (
  { contracts }: ENSArgs<'contracts'>,
  name: string,
  resolver?: string,
) => {
  if (resolver) return resolver
  const registry = await contracts!.getRegistry()
  const node = namehash(name)
  const _resolver = await registry.resolver(node)
  return _resolver
}
