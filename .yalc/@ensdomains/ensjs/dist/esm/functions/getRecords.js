import { parseInputType } from '../utils/validation'
export default async function ({ getProfile }, name, options) {
  const inputType = parseInputType(name)
  if (inputType.type !== 'name' && inputType.type !== 'label') {
    throw new Error('Input must be an ENS name')
  }
  return await getProfile(name, options)
}
